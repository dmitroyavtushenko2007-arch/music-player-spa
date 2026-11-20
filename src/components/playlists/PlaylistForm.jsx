import { useState } from "react";

function PlaylistForm({ onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});

  // проста перевірка полів
  function validate() {
    const newErrors = {};
    const trimmedName = name.trim();

    if (!trimmedName) {
      newErrors.name = "Введіть назву плейліста";
    } else if (trimmedName.length < 3) {
      newErrors.name = "Назва має містити щонайменше 3 символи";
    } else if (trimmedName.length > 30) {
      newErrors.name = "Назва — не більше 30 символів";
    }

    if (description.length > 100) {
      newErrors.description = "Опис — не більше 100 символів";
    }
    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    onCreate(name.trim(), description.trim());
    setName("");
    setDescription("");
  }

  return (
    <form className="playlist-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="playlist-name">Назва</label>
        <input
          id="playlist-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Наприклад, Ранкова пробіжка"
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="playlist-description">Опис (необов'язково)</label>
        <input
          id="playlist-description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Короткий опис"
        />
        {errors.description && <p className="form-error">{errors.description}</p>}
      </div>

      <button type="submit" className="btn btn--accent">
        Створити плейліст
      </button>
    </form>
  );
}

export default PlaylistForm;
