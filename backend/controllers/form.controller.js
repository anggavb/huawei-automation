import form from '../service/form.service.js';
import response from '../utils/response.js';

class FormController {
  getForm(req, res) {
    const formData = form.getForm();
    res.status(200).json(response('Form retrieved successfully.', formData, null));
  }

  createForm(req, res) {
    const { name, from } = req.body;
    if (!name || !from) {
      return res.status(400).json(response('Name and From fields are required.', null, ['Name and From fields are required.']));
    }

    const data = { name, from };
    const createdForm = form.create(data);
    res.status(201).json(response('Form created successfully.', createdForm, null));
  }
}

export default new FormController();