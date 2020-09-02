using System;
using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.ApplicationInsights;
using Microsoft.OpenApi.Models;
using Server.DbModels;
using Server.Repository;
using Server.Repository.Interfaces;
using Server.Shared;

namespace Server
{
    public class Startup
    {
        private readonly IConfiguration _conf;
        private readonly IWebHostEnvironment _env;

        public Startup(IConfiguration conf, IWebHostEnvironment env)
        {
            _conf = conf;
            _env = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddCors();
            services.AddMemoryCache();
            services.AddHttpContextAccessor();
            services.AddLogging(builder =>
            {
                builder.AddApplicationInsights(_conf["APPINSIGHTS_INSTRUMENTATIONKEY"]);
                builder.AddFilter<ApplicationInsightsLoggerProvider>("", LogLevel.Trace);
                builder.AddFilter<ApplicationInsightsLoggerProvider>("Microsoft", LogLevel.Error);
            });
            services.AddApplicationInsightsTelemetry();

            // Add DB
            services.AddDbContext<StuffDbContext>(options => options.UseSqlite(
                _conf.GetConnectionString("SqlConnectionString"),
                sqlServerOptions => sqlServerOptions.CommandTimeout(int.Parse(_conf.GetConnectionString("SqlCommandTimeout"))))
            );

            // Add Authent
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.Authority = _conf["JwtToken:Authority"];
                    options.Audience = _conf["JwtToken:Audience"];
                });

            services.AddMvc(options =>
            {
                options.Filters.Add(typeof(TraceHandler));
                options.Filters.Add(typeof(ModelValidationFilter));
            }).SetCompatibilityVersion(CompatibilityVersion.Latest);

            services.Configure<ApiBehaviorOptions>(options =>
            {   // Managed by Common/ModelValidationFilter.cs
                options.SuppressModelStateInvalidFilter = true;
            });

            var now = DateTime.Now;
            services.AddHsts(configureOptions =>
            {
                configureOptions.Preload = true;
                configureOptions.IncludeSubDomains = true;
                configureOptions.MaxAge = now.AddYears(1) - now;
            });

            services.AddHttpsRedirection(options =>
            {
                options.RedirectStatusCode = StatusCodes.Status308PermanentRedirect;
                options.HttpsPort = 443;
            });

            // Register the Swagger generator
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Server", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme."
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            // Register Repo
            services.AddScoped<IUserAuthRepo, UserAuthRepo>();
            services.AddScoped<IUserRepo, UserRepo>();
            services.AddScoped<IStuffRepo, StuffRepo>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app)
        {
            if (_env.IsDevelopment())
            {
                app.UseCors(options => options.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            }
            else
            {
                var corsList = _conf["AuthCors"].Split(" ");
                app.UseCors(builder => builder
                    .WithOrigins(corsList)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                );
            }

            // React hosted by Web API ==> ignoring React for auth
            // - /authentication/callback
            // - /authentication/silent_callback
            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = new PathString("/index.html");
                    await next();
                }
            });

            app.UseFileServer(new FileServerOptions
            {
                EnableDirectoryBrowsing = false,
                EnableDefaultFiles = true,
                DefaultFilesOptions = { DefaultFileNames = { "index.html" } }
            });

            if (!_env.IsProduction())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Server V1");
                });
            }

            app.Use(async (context, next) =>
            {
                context.Response.Headers.Remove("Server");
                context.Response.Headers.Remove("X-Powered-By");
                context.Response.Headers.Remove("X-UA-Compatible");
                context.Response.Headers.Add("X-UA-Compatible", "IE=Edge,chrome=1");
                context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
                context.Response.Headers.Add("Referrer-Policy", "no-referrer");
                context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
                context.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");
                context.Response.Headers.Add("Content-Security-Policy", "frame-ancestors 'self'");
                await next();
            });

            app.UseExceptionHandler("/api/Error");
            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers().RequireAuthorization();
            });
        }
    }
}
