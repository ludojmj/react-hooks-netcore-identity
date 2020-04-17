import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useReactOidc } from "@axa-fr/react-oidc-context";

import Error from './Error';
import StuffCreate from './StuffCreate';
import StuffRead from './StuffRead';
import StuffUpdate from './StuffUpdate';
import StuffDelete from './StuffDelete';
import StuffList from './StuffList';

import useApi from '../hooks/useApi';

const rootApi = process.env.REACT_APP_API_URL;
const isMock = rootApi.indexOf("mock") > -1;
const extMock = isMock ? ".json" : "";

const CrudManager = () => {
  const initialUrl = rootApi + extMock;
  const initialDatum = { label: "", description: "", otherInfo: "" };

  // Setting state
  const [search, setSearch] = useState({ filter: "" });

  const [currentDatum, setCurrentDatum] = useState(initialDatum);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reading, setReading] = useState(false);

  // Auth
  const { oidcUser } = useReactOidc();
  const { profile } = oidcUser ? oidcUser : { profile: { sub: "?", name: "?" } };
  const httpHeaders = { Authorization: oidcUser ? `Bearer ${oidcUser.access_token}` : "NoAuth" };

  // API
  const [{ isLoading, error, stuff }, makeRequest] = useApi({
    url: initialUrl,
    method: "get",
    headers: httpHeaders,
    data: {}
  });

  // CRUD operations
  const createStuff = datum => {
    setCreating(!creating);
    makeRequest({
      url: initialUrl,
      method: isMock ? "get" : "post",
      headers: httpHeaders,
      data: datum
    });
  }

  const updateStuff = (id, updatedDatum) => {
    setUpdating(!updating);
    makeRequest({
      url: isMock ? initialUrl : `${initialUrl}/${id}`,
      method: isMock ? "get" : "put",
      headers: httpHeaders,
      data: updatedDatum
    });
  }

  const deleteStuff = id => {
    setDeleting(!deleting);
    makeRequest({
      url: isMock ? initialUrl : `${initialUrl}/${id}`,
      method: isMock ? "get" : "delete",
      headers: httpHeaders,
      data: {}
    });
  }

  // Click actions
  const handleReset = () => {
    setSearch({ filter: "" });
    makeRequest({
      url: initialUrl,
      method: "get",
      headers: httpHeaders,
      data: {}
    });
  }

  const handleSearch = (event) => {
    event.preventDefault();
    if (search.filter.length) {
      makeRequest({
        url: `${initialUrl}?search=${search.filter}`,
        method: "get",
        headers: httpHeaders,
        data: {}
      });
      return;
    }

    handleReset();
  }

  const handlePage = event => {
    const page = event.currentTarget.value === "+" ? stuff.page + 1 : stuff.page - 1;
    makeRequest({
      url: `${initialUrl}?page=${page}`,
      method: "get",
      headers: httpHeaders,
      data: {}
    });
    setSearch({ filter: "" });
  }

  const handleChangeFilter = event => {
    const { name, value } = event.target;
    setSearch({ ...search, [name]: value });
  }

  const handleCreate = () => {
    setCreating(true);
    setCurrentDatum(initialDatum);
  }

  const handleRead = datum => {
    setReading(true);
    setCurrentDatum(datum);
  }

  const handleUpdate = datum => {
    setUpdating(true);
    setCurrentDatum(datum);
  }

  const handleDelete = datum => {
    setDeleting(true);
    setCurrentDatum(datum);
  }

  const closeModal = () => {
    setCreating(false);
    setReading(false);
    setUpdating(false);
    setDeleting(false);
    setCurrentDatum(initialDatum);
  }

  // Error
  if (error) {
    return <Error msg={error} />;
  }

  // Loading
  if (isLoading) {
    return <progress></progress>;
  }

  if (!stuff) {
    return null;
  }

  if (creating) { return <StuffCreate isOpen={creating} onSubmit={createStuff} currentDatum={currentDatum} closeModal={closeModal} /> }
  if (reading) { return <StuffRead isOpen={reading} onSubmit={closeModal} currentDatum={currentDatum} closeModal={closeModal} /> }
  if (updating) { return <StuffUpdate isOpen={updating} onSubmit={updateStuff} currentDatum={currentDatum} closeModal={closeModal} /> }
  if (deleting) { return <StuffDelete isOpen={deleting} onSubmit={deleteStuff} currentDatum={currentDatum} closeModal={closeModal} /> }

  return (
    <div className="w60 center">
      <div className="txtright">
        <NavLink to="/">
          <span className="btn--inverse">{profile.name}</span>
        </NavLink>
      </div>

      <form onSubmit={handleSearch} className="autogrid has-gutter-l">
        <input
          autoFocus
          type="text"
          maxLength="20"
          name="filter"
          placeholder="Filter"
          value={search.filter}
          onChange={handleChangeFilter}
        />
        <button className="btn--primary">Search</button>
        <button className="btn--info" onClick={handleReset}>Reset</button>
        <div>
          <button className="badge--primary" value="-" onClick={handlePage} disabled={stuff.page === 1 && "disabled"}><i className="icon-arrow--left" /></button>
          <span className="tag--warning nowrap">Page {stuff.page}/{stuff.totalPages}</span>
          <button className="badge--primary" value="+" onClick={handlePage} disabled={stuff.page === stuff.totalPages && "disabled"}><i className="icon-arrow--right" /></button>
        </div>
        <button className="btn--success" onClick={handleCreate}>Create</button>
      </form>

      <StuffList
        currentUserId={oidcUser.profile.sub}
        datumList={stuff.datumList}
        handleRead={handleRead}
        handleUpdate={handleUpdate}
        handleDelete={handleDelete} />
    </div>
  );
}

export default CrudManager;
