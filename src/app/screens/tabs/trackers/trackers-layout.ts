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
      attribute: 'pin',
      type: FormObjectType.PASSWORD,
      required: true
    },
    {
      attribute: 'active',
      type: FormObjectType.CHECKBOX,
    },
    {
      attribute: 'speedLimit',
      type: FormObjectType.TEXT,
      editable: false
    },
    {
      attribute: 'sleepLimit',
      type: FormObjectType.TEXT,
      editable: false
    },
    {
      attribute: 'ignitionAlarm',
      type: FormObjectType.TEXT,
      editable: false
    },
    {
      attribute: 'powerAlarmSMS',
      type: FormObjectType.TEXT,
      editable: false
    },
    {
      attribute: 'powerAlarmCall',
      type: FormObjectType.TEXT,
      editable: false
    },
    {
      attribute: 'battery',
      type: FormObjectType.TEXT,
      editable: false
    }
  ];
}
