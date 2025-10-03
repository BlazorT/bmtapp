import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { dateFormatter, safeJSONParse } from '../../helper/dateFormatter';
import { GENDER_LIST } from '../../constants';
import Icon from 'react-native-vector-icons/Entypo';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome5';
import servicesettings from '../../modules/dataservices/servicesettings';
import Video from 'react-native-video';
const CampaignDetail = ({ campaign }) => {
  const theme = useTheme();
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentErrors, setAttachmentErrors] = useState({}); // { index: true }

  const RowView = ({ label, value }) => {
    return (
      <View style={styles.row}>
        <Text style={[{ color: theme.textColor }]}>{label || ''}</Text>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Text style={[{ color: theme.textColor }]}>{value || '--'}</Text>
        ) : (
          value
        )}
      </View>
    );
  };

  const compaignsdetails = safeJSONParse(campaign?.compaignsdetails, []);
  const targetaudiance = safeJSONParse(campaign?.targetaudiance, null);
  const attachments = safeJSONParse(campaign?.attachments, []);
  const normalizeUrl = path => {
    if (!path) return null;
    return servicesettings.Imagebaseuri + path.replace(/\\/g, '/');
  };
  return (
    <View style={styles.container}>
      <RowView label={'Description'} value={campaign?.description} />
      <RowView
        label={'Start Time'}
        value={dateFormatter(campaign?.startTime)}
      />
      <RowView
        label={'Finish Time'}
        value={dateFormatter(campaign?.finishTime)}
      />
      <RowView
        label={'Networks'}
        value={compaignsdetails?.map(c => c.networkName)?.join(', ')}
      />
      <RowView label={'Contact'} value={campaign?.contact} />
      <RowView label={'Hash Tags'} value={campaign?.hashTags} />
      {targetaudiance && (
        // inside your component
        <>
          <View style={styles.dividerRow}>
            <View
              style={[styles.dividerLine, { backgroundColor: theme.textColor }]}
            />
            <Text style={[styles.dividerText, { color: theme.textColor }]}>
              Target Audiance
            </Text>
            <View
              style={[styles.dividerLine, { backgroundColor: theme.textColor }]}
            />
          </View>

          {typeof targetaudiance?.genderId === 'number' &&
            targetaudiance.genderId > 0 && (
              <RowView
                label="Gender"
                value={
                  GENDER_LIST?.find(gl => gl.id === targetaudiance.genderId)
                    ?.name || ''
                }
              />
            )}

          {targetaudiance?.interests?.length > 0 && (
            <RowView
              label="Interests"
              value={targetaudiance?.interests?.map(i => i)?.join(', ')}
            />
          )}

          {targetaudiance?.minAge > 0 && (
            <RowView label="Min Age" value={targetaudiance.minAge} />
          )}

          {targetaudiance?.maxAge > 0 && (
            <RowView label="Max Age" value={targetaudiance.maxAge} />
          )}

          {targetaudiance?.locations?.length > 0 && (
            <RowView
              label="Locations"
              value={
                <View style={styles.locationsWrapper}>
                  {targetaudiance.locations.map((cl, index) => (
                    <View
                      key={index}
                      style={[
                        styles.locationChip,
                        { backgroundColor: theme.selectedCheckBox },
                      ]}
                    >
                      <Text
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={[
                          styles.locationText,
                          { color: theme.textColor },
                        ]}
                      >
                        {cl?.AreaName}
                      </Text>
                    </View>
                  ))}
                </View>
              }
            />
          )}
        </>
      )}
      <View
        style={[styles.dividerLine, { backgroundColor: theme.textColor }]}
      />
      <RowView label="Discount" value={campaign?.discount} />
      <RowView label="Budget" value={campaign?.totalBudget} />
      <RowView label="Remarks" value={campaign?.description} />
      {attachments?.length > 0 ? (
        <TouchableOpacity
          style={styles.collapseHeader}
          onPress={() => setShowAttachments(prev => !prev)}
        >
          <View style={styles.collapseLabel}>
            <Icon name="attachment" size={20} color={theme.textColor} />
            <Text style={[styles.collapseText, { color: theme.textColor }]}>
              Attachments
            </Text>
          </View>
          <Icon
            name={showAttachments ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.textColor}
          />
        </TouchableOpacity>
      ) : null}
      {showAttachments && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.collapseContent}
          contentContainerStyle={styles.collapseRow}
        >
          {attachments.map((file, index) => {
            const url = normalizeUrl(file?.image);
            if (!url) return null;

            // if this attachment failed
            if (attachmentErrors[index]) {
              return (
                <View
                  key={index}
                  style={[styles.fileWrapper, styles.errorWrapper]}
                >
                  <Text style={{ color: theme.textColor }}>
                    ❌ Failed to load
                  </Text>
                </View>
              );
            }

            // IMAGE
            if (/\.(jpg|jpeg|png)$/i.test(url)) {
              return (
                <View key={index} style={styles.fileWrapper}>
                  <Image
                    source={{ uri: url }}
                    style={styles.previewFile}
                    onError={() =>
                      setAttachmentErrors(prev => ({ ...prev, [index]: true }))
                    }
                  />
                </View>
              );
            }

            // VIDEO
            if (/\.(mp4|mov)$/i.test(url)) {
              return (
                <View key={index} style={styles.fileWrapper}>
                  <Video
                    source={{ uri: url }}
                    style={styles.previewFile}
                    resizeMode="cover"
                    repeat
                    controls
                    onError={() =>
                      setAttachmentErrors(prev => ({ ...prev, [index]: true }))
                    }
                  />
                </View>
              );
            }

            // PDF
            if (/\.pdf$/i.test(url)) {
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.fileWrapper, styles.pdfWrapper]}
                  onPress={() => Linking.openURL(url)}
                >
                  <FontAwesome6Icon
                    name="file-pdf"
                    size={40}
                    color={theme.textColor}
                  />
                  <Text style={{ color: theme.textColor, marginTop: 4 }}>
                    PDF Document
                  </Text>
                </TouchableOpacity>
              );
            }

            return null;
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    rowGap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  locationsWrapper: {
    flexDirection: 'row',
    columnGap: 5,
    rowGap: 5,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    width: '65%',
  },
  locationChip: {
    padding: 5,
    borderRadius: 6,
    flexDirection: 'row',
  },
  locationText: {
    width: 100,
  },
  collapseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  collapseLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  collapseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  collapseContent: {
    marginTop: 8,
  },
  collapseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  fileWrapper: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  previewFile: {
    width: 300,
    height: 250,
    borderRadius: 6,
  },
  pdfWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 250,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  errorWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    height: 250,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 6,
  },
});

export default CampaignDetail;
