import React from 'react';

const StuffList = props => {
  return (
    <table className="table table--zebra" summary="List of stuff">
      <caption>.List of stuff</caption>
      <thead>
        <tr>
          {/* <th scope="col">id</th> */}
          <th scope="col">Label</th>
          <th scope="col">Description</th>
          <th scope="col">CreatedAt</th>
          <th scope="col">UpdatedAt</th>
          <th colSpan="3"></th>
        </tr>
      </thead>
      <tbody>
        {props.datumList.map(datum => {
          return (
            <tr key={datum.id}>
              {/* <td data-label="id">{datum.id}</td> */}
              <td data-label="Label">{datum.label}</td>
              <td data-label="Descpription">{datum.description}</td>
              <td data-label="createdAt">{datum.createdAt ? <code>{new Date(datum.createdAt).toLocaleString()}</code> : "-"}</td>
              <td data-label="updatedAt">{datum.updatedAt ? <code>{new Date(datum.updatedAt).toLocaleString()}</code> : "-"}</td>
              <td><button className="btn--success" value={datum.id} onClick={() => props.handleRead(datum)}>Read</button></td>
              {datum.user.id === props.currentUserId
                ?
                <>
                  <td><button className="btn--warning" value={datum.id} onClick={() => props.handleUpdate(datum)}>Update</button></td>
                  <td><button className="btn--danger" onClick={() => props.handleDelete(datum)}>Delete</button></td>
                </>
                :
                <td colSpan="2">Owned by: <code>{datum.user.givenName} {datum.user.familyName}</code></td>}
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

export default StuffList;
