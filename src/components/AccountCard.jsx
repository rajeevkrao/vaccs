import React from 'react';

const skinsImage = () => {
  return <img style={{ width: "7rem", position: "absolute", right: "1vw", top: "1vh" }} className="card-img-top" src="https://vranks.rkrao.me/skinsStatus.png" alt="Skins" />
}

export const AccountCard = ({ item, index, ranks, handleEdit, onCopy, style }) => {
  const title = item.name ? `Name: ${item.name}` : `Username: ${item.username}`;
  var rankImage = '';
  if (ranks && ranks[item?.rank]) {
    rankImage = ranks[item.rank];
  }

  const copyText = (text, message) => {
    navigator.clipboard.writeText(text);
    if (onCopy) onCopy(message);
  };

  return (
    <div className="card" style={style}>
      <div className="card-body">
        <div style={{ textAlign: "right", position: "absolute", right: "1vw", bottom: "1vh" }}>
          <button onClick={() => handleEdit(index)} className="copy action" title="Edit">
            <i className="fa-regular fa-pen-to-square"></i>
          </button>
          <button onClick={() => copyText(item.name || item.username, 'Name Copied')} className="copy action" title="Copy Info">
            <i className="fa-regular fa-copy"></i>
          </button>
        </div>
        {item.skins ? skinsImage() : null}
        <h5 className="card-title">{title}</h5>
        <p className="card-text">
          Username: {item.username} <span onClick={() => copyText(item.username, 'Username Copied')} className="copy"><i className="fa-regular fa-copy"></i></span><br />
          Password: ******** <span onClick={() => copyText(item.password, 'Password Copied')} className="copy"><i className="fa-regular fa-copy"></i></span><br />
          Rank: {item.rank}<br />
          <span><img className="rank" src={rankImage} alt={item.rank} /></span>
        </p>
      </div>
    </div>
  );
};
