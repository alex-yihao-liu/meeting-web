import dayjs from 'dayjs';

export const formatMeetingTime = (date: Date) => {
    return dayjs(date).format('HH:mm');
}