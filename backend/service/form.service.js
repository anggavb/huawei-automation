import form from '../repository/form.repository.js';

class FormService {
  getForm() {
    return form;
  }

  create(data) {
    const newData = {
      id: form.length + 1,
      name: data.name,
      from: data.from,
    };

    form.push(newData);
    return newData;
  }
}

export default new FormService();