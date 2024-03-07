import { DATA_TYPE } from 'lib/constants';
import { uuid } from 'lib/crypto';
import { flattenJSON, getStringValue } from 'lib/data';
import prisma from 'lib/prisma';
import { DynamicData } from 'lib/types';

export async function saveVisitorData(data: {
  websiteId: string;
  visitorId: string;
  visitorData: DynamicData;
}) {
  const { client, transaction } = prisma;
  const { websiteId, visitorId, visitorData } = data;

  const jsonKeys = flattenJSON(visitorData);

  const flattendData = jsonKeys.map(a => ({
    id: uuid(),
    websiteId,
    visitorId,
    key: a.key,
    stringValue: getStringValue(a.value, a.dataType),
    numberValue: a.dataType === DATA_TYPE.number ? a.value : null,
    dateValue: a.dataType === DATA_TYPE.date ? new Date(a.value) : null,
    dataType: a.dataType,
  }));

  return transaction([
    client.visitorData.deleteMany({
      where: {
        visitorId,
      },
    }),
    client.visitorData.createMany({
      data: flattendData as any,
    }),
  ]);
}
