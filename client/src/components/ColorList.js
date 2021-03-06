import React, { useState } from "react";
import axios from "axios";
import { axiosWithAuth } from '../utils/axiosWithAuth';

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const [addColor, setAddColor] = useState(initialColor)

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      .put(`http://localhost:5000/api/colors/${colorToEdit.id}`, colorToEdit)
      .then(res => {
        // console.log(res.data)
        axiosWithAuth()
          .get(`http://localhost:5000/api/colors`)
          .then(res => {
            console.log(res)
            updateColors(res.data)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  };

  const deleteColor = color => {
    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`)
      .then(res => {
        axiosWithAuth()
          .get(`http://localhost:5000/api/colors`)
          .then(res => {
            console.log(res.data)
            updateColors(res.data)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  };

  const submitColor = (e) => {
    // e.preventDefault();

    axiosWithAuth()
      .post(`http://localhost:5000/api/colors`, addColor)
      .then(res => {
        axiosWithAuth()
          .get(`http://localhost:5000/api/colors`)
          .then(res => {
            console.log(res.data)
          setAddColor(res.data)
          })
          .catch(err => console.log(err))
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="colors-wrap">
      <h2>colors list</h2>
      <h6>add color</h6>
      <form onSubmit={submitColor}>
        <label>
          color name:
        <input
          placeholder='color name'
          onChange={e =>
          setAddColor({ ...addColor, color: e.target.value })
        } />
        </label>
        <label>
          hex code:
        <input
          placeholder='hex code'
          onChange={e =>
          setAddColor({
            ...addColor,
            code: { hex: e.target.value }
          })
        } />
        </label>
        <button className='submit-btn' type="submit">submit</button>
      </form>
      
      
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={e => {
                    e.stopPropagation();
                    deleteColor(color)
                  }
                }>
                  x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
