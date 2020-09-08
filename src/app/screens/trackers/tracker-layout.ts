import {FormObjectField} from '../../components/form-object/form-object-field';
import {FormObjectType} from '../../components/form-object/form-object-type';

/**
 * Form layouts used for the tracker data. Multiple layouts are used for different information about the tracker.
 */
export class TrackerLayout {

  public static layout: FormObjectField[] = [
    {
      attribute: 'name',
      type: FormObjectType.TEXT,
      editable: true,
      required: true
    },
    {
      attribute: 'phoneNumber',
      type: FormObjectType.PHONE,
      editable: true,
      required: true
    },
    {
      attribute: 'pin',
      type: FormObjectType.PASSWORD,
      editable: true,
      required: true
    },
    {
      attribute: 'licensePlate',
      type: FormObjectType.TEXT,
      editable: true,
    },
    {
      attribute: 'chassisNumber',
      type: FormObjectType.TEXT,
      editable: true,
    }
  ];

  public static data: FormObjectField[] = [
    {
      attribute: 'speedLimit',
      type: FormObjectType.NUMBER,
      editable: false
    },
    {
      attribute: 'sleepLimit',
      type: FormObjectType.NUMBER,
      editable: false
    },
    {
      attribute: 'ignitionAlarm',
      type: FormObjectType.CHECKBOX,
      editable: false
    },
    {
      attribute: 'powerAlarmSMS',
      type: FormObjectType.CHECKBOX,
      editable: false
    },
    {
      attribute: 'powerAlarmCall',
      type: FormObjectType.CHECKBOX,
      editable: false
    },
    {
      attribute: 'battery',
      type: FormObjectType.NUMBER,
      editable: false
    },
    {
      attribute: 'iccid',
      type: FormObjectType.TEXT,
      editable: false
    },
    {
      attribute: 'id',
      type: FormObjectType.TEXT,
      editable: false
    },
    {
      attribute: 'apn',
      type: FormObjectType.TEXT,
      editable: false
    }
  ];
}
