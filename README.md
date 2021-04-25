# All-In-One CRUD

```bash
git clone https://github.com/ludojmj/react-hooks-netcore-identity.git
```

Developing a CRUD Web App is just an excuse.
The aim of this project is to gather, in a single place, useful front and back ends development tools:

- A Database with SQLite;
- A Web API server with .NET Core 3.x;
- A client App in React with Hooks;
- A link to an external service for identity management, authorization, and API security.

## Quick start

Server

```bash
cd <myfolder>/Server
dotnet run
```

Client

```bash
cd <myfolder>/client
npm install
npm start
```

---

## Inspiration

- SQLite database powered by: <https://www.sqlite.org>
- Server based on API mechanisms of: <https://reqres.in/api/whatever>
- React client inspired by the work of: [Tania Rascia](https://github.com/taniarascia/react-hooks)
- Handling data with React Hooks inspired by the work of: [Robin Wieruch](https://github.com/the-road-to-learn-react/react-hooks-introduction)
- Identity service powered by: <https://demo.identityserver.io>
- Identity client borrowed from: [AxaGuilDev](https://github.com/AxaGuilDEv/react-oidc)
- CSS borrowed from: [Raphaël Goetter](https://github.com/alsacreations/KNACSS)
- SVG borrowed from: <https://creativecommons.org>

---

## Manufacturing process steps

### >>>>> SQLite database

#### Overwrite database if needed

```bash
cd <myfolder>
sqlite3 Server/App_Data/stuff.db < Server/App_Data/create_tables.sql
```

### >>>>> .NET Core 3.x Web API server

#### Create the server project

```bash
cd <myfolder>
dotnet new gitignore
dotnet new webapi -n Server
dotnet new xunit -n Server.UnitTest
```

#### Generate the model from the database for the Web API server

```bash
dotnet tool install --global dotnet-ef
cd <myfolder>/Server
dotnet ef dbcontext scaffold "Data Source=App_Data/stuff.db" Microsoft.EntityFrameworkCore.Sqlite \
--output-dir DbModels --context-dir DbModels --context StuffDbContext --force
```

#### Run the tests

```bash
cd <myfolder>/Server.UnitTest
dotnet restore
dotnet build
dotnet test
dotnet test /p:CollectCoverage=true
```

#### Run the Web API server

```bash
cd <myfolder>/Server
export ASPNETCORE_ENVIRONMENT=Development
dotnet run
```

### >>>>> React client App

#### Create the client project

```bash
cd <myfolder>
npx create-react-app client
```

#### Run the client App

```bash
cd <myfolder>/client
npm install
npm start
```

#### Possibly run a standalone version of the client App (mocking) except identity server

The last line of the file:

 > ```<myfolder>/client/.env.development``` (or ```<myfolder>/client/.env.development.local```)

must be:

 > ```REACT_APP_API_URL=/mock/stuff```

---

## Troubleshooting

### _An error occured. Please try again later._

**When?**

- Creating a record in the SQLite database _stuff.db_ running Linux on Azure;
- The "real" error (not displayed in Production) is: _SQLite Error 5: 'database is locked'_;
- There is a restricted write access to the file on Linux web app when running on Azure.

**How to solve:**

- ==> Either use a real database or deploy the web app on Azure choosing Windows OS.

### _SQLite Error 1: 'no such table: t_stuff'_

**When?**

- Running the React client App (```npm start```);
- Connecting to: <http://localhost:3000/>.

**How to solve:**

- ==> Create the database _stuff.db_ (```sqlite3 Server/App_Data/stuff.db < Server/App_Data/create_tables.sql```).

### _Network Error_

**When?**

- Running the React client App (```npm start```);
- Connecting to: <http://localhost:3000/>.

**How to solve:**

- ==> Start the .NET Core server (```dotnet run```) before the React client App (```npm start```).

### _Your connection is not private_ (NET::ERR_CERT_AUTHORITY_INVALID)

**When?**

- Running the .NET Core server (dotnet run);
- Connecting to: <http://localhost:5000/swagger>;
- Or connecting to its redirection: <https://localhost:5001/swagger>.

**How to solve:**

- ==> Click "Advanced settings" button;
- ==> Click on the link to continue to the assumed unsafe localhost site;
- ==> Accept self-signed localhost certificate.

### _You do not have permission to view this directory or page._

**When?**

- Browsing the web site on a Azure Windows instance.

**How to solve:**

- ==> Add the web.config file since you've got IIS running;
- ==> On Linux, the web.config file is useless
(Update your http headers according to the suitable Web Server configuration file).
