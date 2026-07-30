import {ROUTER_URLS} from '@constants/routerUrls';

type EventPageTab = 'home' | 'admin';

const getEventPageUrlByEnvironment = (eventId: string, tab: EventPageTab) => {
  return `${window.location.origin}${ROUTER_URLS.event}/${eventId}/${tab}`;
};

export default getEventPageUrlByEnvironment;
