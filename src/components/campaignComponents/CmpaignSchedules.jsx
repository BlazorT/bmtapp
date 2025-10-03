import { View, Text, FlatList } from 'react-native';
import React from 'react';
import { safeJSONParse } from '../../helper/dateFormatter';
import MycampaignScheduleList from '../MycampaignScheduleList';

const CmpaignSchedules = ({ campaign }) => {
  const compaignschedules = safeJSONParse(campaign?.compaignschedules, []);
  const compaignsdetails = safeJSONParse(campaign?.compaignsdetails, []);
  return (
    <FlatList
      data={compaignschedules}
      keyExtractor={(item, id) => id.toString()}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <MycampaignScheduleList
          // ActionButtonClick={ActionButtonClick}
          data={item.data}
          id={item.id}
          compaignDetailId={item.CompaignDetailId}
          networkId={item.NetworkId}
          interval={item.Interval}
          budget={item.budget}
          messageCount={item.MessageCount}
          intervaltypename={item.intervaltypename}
          intervalTypeId={item.IntervalTypeId}
          startTime={item.StartTime}
          finishTime={item.FinishTime}
          days={item.days}
          template={safeJSONParse(
            compaignsdetails?.find(cd => cd?.networkId === item?.NetworkId)
              ?.template,
            null,
          )}
        ></MycampaignScheduleList>
      )}
      numColumns={1}
      horizontal={false}
    />
  );
};

export default CmpaignSchedules;
