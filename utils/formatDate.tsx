import {DateTime} from 'luxon';

const formatDate = (date: Date): string => {
  return DateTime.fromISO(date.toString()).toFormat('dd/LL/yyyy');
}

export default formatDate;