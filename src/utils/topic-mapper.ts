import { getEnv } from '@fullstacksjs/toolbox';
import { ChangeStreamDocument, Document } from 'mongodb';
import _ from 'lodash';

export function topicMapper(cdcObject: ChangeStreamDocument<Document>):string  {
const mqttTopic = getEnv('MQTT_TOPIC', '/')
const mqttValueKeys: string[] = getEnv('MQTT_TOPIC_VALUE_FROM_CDS_KEYS', null)?.split(' ')

try {
  let values = _.at(cdcObject["fullDocument"], mqttValueKeys);
  values = _.map(values, item => _.isUndefined(item) ? 'undefined' : item);

  
  const replacementsValues: string[] = values.map(String);
  
  let currentIndex = 0;
  const replacedStr = mqttTopic.replace(/\?/g, () => {
      const replacement = replacementsValues[currentIndex];
      currentIndex = (currentIndex + 1) % replacementsValues.length;
      return replacement;
    }); 
    return `${replacedStr}/${cdcObject.operationType}`
} catch (error) {
  console.error(error.message)
  return '/error-with-mapping-mqtt-topic'
}
}