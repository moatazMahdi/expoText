import {
  FieldsData,
  KeylessFormFieldData,
} from '../../types';

export class FormFieldsBuilder<RootFormViewModel, FormViewModel = RootFormViewModel> {
  private _formFields: FieldsData<FormViewModel> = [];

  addField<T extends keyof FormViewModel>(key: T, fieldOptions: KeylessFormFieldData<FormViewModel, T>) {
    this._formFields.push({
      key,
      ...fieldOptions,
    } as any);
    return this;
  }

  addPreviewComponent(component: React.ComponentType<RootFormViewModel>) {
    this._formFields.push({
      component: component as any,
    });
    return this;
  }

  get formFields() {
    return this._formFields;
  }
}
