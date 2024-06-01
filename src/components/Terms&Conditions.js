import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../styles';
const arrowback = require('../../assets/images/icons/BackArrow.png');

const TermsAndConditions = props => {
  const [modalVisible, setmodalVisible] = useState(false);

  //*************************************************** View *******************************************************************//

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.modalVisible}
        onRequestClose={() => {
          setmodalVisible(!props.modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View
            style={Platform.OS === 'ios' ? styles.Headerios : styles.Header}
          >
            <TouchableOpacity onPress={() => props.TermsAndConditionsClose()}>
              <View style={styles.arrowIcon}>
                <Image
                  tintColor={'white'}
                  source={arrowback}
                  style={styles.arrow}
                />
              </View>
            </TouchableOpacity>
            <Text style={styles.HeaderText}> Terms & Conditions (EULA)</Text>
          </View>

          <View style={styles.CommentView}>
            <ScrollView>
              <View style={styles.Titleview}>
                <Text style={styles.Heading}>
                  Video-share Guidelines and Privacy Policy
                </Text>
                <Text style={styles.DescriptionStyle}>
                  SPENTEM is created in the spirit of peaceful civic engagement.
                  We do not permit the use of bigoted language, anti-government
                  or anti-law enforcement rhetoric or the provocation of
                  violence of any kind. SPENTEM bears no tolerance for
                  objectionable content or abusive users. We reserve the right
                  to not post any videos that we deem inappropriate or
                  subversive to the spirit of our platform.
                </Text>
              </View>
              <View style={styles.Titleview}>
                <Text style={styles.Heading}>
                  Do not post, upload, stream, or share:
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that boasts, praise or promotes past, present, or
                  future crimes
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Unnecessary graphic details of crimes{' '}
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Yours or anyone else’s’ legal paperwork including court
                  documents, prison documents or official documents from
                  government agencies{' '}
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Admissions of guilt for crimes you have not been convicted
                  of
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Names of individuals other than yourself or the loved one
                  you are speaking on behalf of
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Individual personal addresses of you or anyone else
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Names of victims, co-defendants, witnessed or perpetrators
                  nor names of specific correctional officers
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that encourages aggressive / angry words or actions
                  directed at public officials, officers of the court,
                  correctional officers, judges or any employee of the state
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Gang names, symbols, flags, logos or gestures
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that ridicules victims or their families
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Firearms or weapons of any kind including ammunition and /
                  or accessories
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that slanders, belittles, or abuses United States
                  armed forces or any of its branches
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that depicts or promotes the usage of drugs, and or
                  alcohol
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that solicits money or financial assistance for you,
                  your loved one or any one at all
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that expresses, insinuates, or hints at the guilt of
                  non-convicted citizens
                </Text>
                <Text style={styles.DescriptionStyle}>► Explicit language</Text>
                <Text style={styles.DescriptionStyle}>
                  ► Violent threats against any individual or entity of any kind
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Nudity or obscenity
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that equates to conspiracy theories
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Misinformation, lies or half-truths
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Personal medical records of you or anyone else
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Personal identity information such as bank account
                  information, bank statements, social security numbers and/or
                  card, drivers license or any other sensitive content of
                  similar nature
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Personal login codes, names or passwords for you or anyone
                  else
                </Text>
                <Text style={styles.DescriptionStyle}>
                  ► Content that violates or infringes on someone else’s legally
                  held copyright, trademark, intellectual property or patten
                </Text>
              </View>
              <View style={styles.Titleview}>
                <Text style={styles.Heading}>Content Integrity</Text>
                <Text style={styles.DescriptionStyle}>
                  SPENTEM expects every video-share to contain authentic stories
                  of truthfulness and honesty without lies fabrications or
                  exaggerations.
                </Text>
                <Text style={styles.DescriptionStyle}>
                  SPENTEM is not responsible for stories or details within a
                  story that may turn out to be falsified by the video-sharer.
                  SPENTEM reserves the right to inquire with family, friends,
                  law enforcement and policymakers about the truthfulness of
                  your story including generalizations and / or details
                  pertaining to people, places, things, and situations. We
                  understand that situational evidence is subjective and that
                  there may be numerous views and opinions about the same
                  incident. If however, SPENTEM discovers that any part of your
                  story is false, your account will be suspended and your video
                  removed permanently.
                </Text>
              </View>
              <View style={styles.Titleview}>
                <Text style={styles.Heading}>
                  By checking this box you agree to all of the above terms and
                  conditions
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default TermsAndConditions;
//**************************************************** styles *********************************************************//
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
  },
  modalView: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: colors.BlazorBg,
  },
  Header: {
    flexDirection: 'row',
    height: 7 + '%',
    borderWidth: 0.3,
    borderBottomColor: 'white',
    width: Dimensions.get('window').width,
  },
  Headerios: {
    marginTop: 7 + '%',
    flexDirection: 'row',
    height: 7 + '%',
    borderWidth: 0.3,
    borderBottomColor: 'white',
    width: Dimensions.get('window').width,
  },
  arrowIcon: {
    marginTop: 20,
    marginLeft: 15,
    width: 20,
    height: 20,
  },
  HeaderText: {
    marginTop: 15,
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  arrow: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  CommentView: {
    height: 87 + '%',
    // borderWidth:0.3,
    //  borderBottomColor: 'white',
    width: Dimensions.get('window').width,
  },

  Heading: {
    //marginLeft:5,
    color: 'white',
    fontSize: 16,
    width: 95 + '%',
    fontWeight: 'bold',
  },
  DescriptionStyle: {
    marginTop: 5,
    width: 95 + '%',
    color: 'white',
    fontSize: 14,
  },
  Titleview: {
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'row',
    // marginLeft:5,
    width: 100 + '%',
    marginTop: 10,
  },
});
