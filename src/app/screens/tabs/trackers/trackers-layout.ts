import {FormObjectField} from '../../../components/form-object/form-object-field';
import {FormObjectType} from '../../../components/form-object/form-object-type';

export class TrackersLayout {
  public static layout: FormObjectField[] = [
    {
      attribute: 'name',
      type: FormObjectType.TEXT,
      required: true
    },
    {
      attribute: 'phoneNumber',
      type: FormObjectType.PHONE,
      required: true
    },
    {
      attribute: 'name',
      type: FormObjectType.TEXT,
      required: false
    }
  ];
}
