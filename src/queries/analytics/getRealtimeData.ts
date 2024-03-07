import { getVisitors, getEvents } from 'queries/index';
import { EVENT_TYPE } from 'lib/constants';

export async function getRealtimeData(websiteId: string, startDate: Date) {
  const [pageviews, visitors, events] = await Promise.all([
    getEvents(websiteId, startDate, EVENT_TYPE.pageView),
    getVisitors(websiteId, startDate),
    getEvents(websiteId, startDate, EVENT_TYPE.customEvent),
  ]);

  const decorate = (type: string, data: any[]) => {
    return data.map((values: { [key: string]: any }) => ({
      ...values,
      __type: type,
      timestamp: values.timestamp ? values.timestamp * 1000 : new Date(values.createdAt).getTime(),
    }));
  };

  const set = new Set();
  const uniques = (type: string, data: any[]) => {
    return data.reduce((arr, values: { [key: string]: any }) => {
      if (!set.has(values.id)) {
        set.add(values.id);

        return arr.concat({
          ...values,
          __type: type,
          timestamp: values.timestamp
            ? values.timestamp * 1000
            : new Date(values.createdAt).getTime(),
        });
      }
      return arr;
    }, []);
  };

  return {
    pageviews: decorate('pageview', pageviews),
    visitors: uniques('visitor', visitors),
    events: decorate('event', events),
    timestamp: Date.now(),
  };
}
