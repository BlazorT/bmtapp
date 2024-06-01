import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
// import ProgressCircle from 'react-native-progress-circle';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/EvilIcons';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
export default function DashboardScreen(props) {
  const [DashboardSummaryDisabled, SetDashboardSummaryDisabled] =
    React.useState(false);

  const [percent, setpercent] = useState(0);
  const [currentMonthData, setCurrentMonthData] = useState('');
  const [graphNewCampaigns, setGraphNewCampaigns] = useState('');
  const [currentVolume, setCurrentVolume] = useState('');
  const [graphValueTotal, setGraphValueTotal] = useState('');
  const [labelNameGraph, setLabelNameGraph] = useState('');
  const [percentageIncrease, setPercentageIncrease] = useState('');
  const [graphLabelMonth, setGraphLabelMonth] = useState([]);
  const [graphLabelMonth1, setGraphLabelMonth1] = useState([]);
  const [graphLabelMonth2, setGraphLabelMonth2] = useState([]);
  const [graphLabelMonthx, setGraphLabelMonthx] = useState([]);
  const [fundsAmountGraph, setFundsAmountGraph] = useState([]);
  const [newCampaignsGraph, setNewCampaignsGraph] = useState([]);
  const [Organization, setOrganization] = useState(10);
  const [Campaign, setCampaign] = useState(10005);
  const [Data, setData] = useState([]);
  const [Vmon, setVmon] = useState(20);
  const [Vtue, setVtue] = useState(13);
  const [Vwed, setVwed] = useState(22);
  const [Vthu, setVthu] = useState(30);
  const [Vfri, setVfri] = useState(12);
  const [Vsat, setVsat] = useState(34);
  const [Vsun, setVsun] = useState(80);
  const [Amon, setAmon] = useState(0);
  const [Atue, setAtue] = useState(0);
  const [Awed, setAwed] = useState(0);
  const [Athu, setAthu] = useState(0);
  const [Afri, setAfri] = useState(0);
  const [Asat, setAsat] = useState(0);
  const [Asun, setAsun] = useState(0);
  /**************************************************** useEffect **************************************************************/
  useEffect(() => {
    DashboardCall();
  });

  //DashboardCall(() => {
  function SaleSummary() {
    SetDashboardSummaryDisabled(true);
  }
  function DashboardCall() {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      const date = new Date();
      var headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          orgId: Asyncdata[0].orgid,
          status: 1,
          id: 0,
          DataOfMonth: '',
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      console.log('headerFetch from dashboard ', headerFetch.body);
      fetch(servicesettings.baseuri + 'dashboard', headerFetch)
        .then(response => response.json())
        .then(responseJson => {
          console.log('responseJson dashboard ', responseJson);
          if (responseJson.data != null) {
            var DashboardData = responseJson.data;
            console.log('DashboardData ', DashboardData.dataOfMonth);
            setGraphLabelMonth(DashboardData[0].dataOfMonth);
            setGraphLabelMonth1(DashboardData[1].dataOfMonth);
            setGraphLabelMonth2(DashboardData[2].dataOfMonth);
            //setGraphLabelMonthx(DashboardData.dataOfMonth);
            setFundsAmountGraph(DashboardData[1].fundsAmount);
            setNewCampaignsGraph(DashboardData[1].newCompaigns);
            var CurrentMonth = DashboardData[DashboardData.length - 1];
            var CurrentMonthDetail = responseJson.data[0].newCompaigns;
            var NewCampaignsList = responseJson.data.newCompaigns;
            var NewCampaignsListXX = responseJson.data;
            var GraphCampaignsList = responseJson.data;
            // var filteredItem = GraphCampaignsList.map(item => item.newCompaigns);
            //console.log('filteredItem ', filteredItem);
            setGraphValueTotal(responseJson.data.newCompaigns);
            var filteredGraphCampaignsLItem = GraphCampaignsList.map(
              item => item.dataOfMonth,
            );
            //setLabelNameGraph(filteredGraphCampaignsLItem);
            console.log(
              'filteredGraphCampaignsLItem ',
              filteredGraphCampaignsLItem,
            );
            var CurrentMonthPercentage =
              responseJson.data[0].percentageIncrease;
            setGraphNewCampaigns(NewCampaignsList);
            var CurrentMonthPercentage =
              responseJson.data[0].percentageIncrease;
            console.log('CurrentMonthPercentage ', responseJson.data[0]);
            console.log('CurrentMonthDetail ', CurrentMonthDetail);
            console.log('CurrentMonth ', CurrentMonth);
            // setCurrentMonthData(CurrentMonthDetail);
            setCurrentMonthData(CurrentMonth.fundsAmount);
            setCurrentVolume(CurrentMonthDetail);
            //setCurrentVolume(CurrentMonth.totalCompaigns);
            setPercentageIncrease(CurrentMonth.percentageIncrease);
            const result = Math.round((CurrentMonthPercentage / 100) * 100);
            setpercent(result);

            //  sonData.seats[jsonData.seats.length-1].countryid
            //{"dataOfDay": "Monday", "totalAllies": 0, "totalLikes": 0, "totalVideos": 1}
            const MondayVideos = responseJson.data.filter(
              x => x.dataOfDay === 'Monday',
            );
            const TuesdayVideos = responseJson.data.filter(
              x => x.dataOfDay === 'Tuesday',
            );
            const WednesdayVideos = responseJson.data.filter(
              x => x.dataOfDay === 'Wednesday',
            );
            const ThursdayVideos = responseJson.data.filter(
              x => x.dataOfDay === 'Thursday',
            );
            const FridayVideos = responseJson.data.filter(
              x => x.dataOfDay === 'Friday',
            );
            const SaturdayVideos = responseJson.data.filter(
              x => x.dataOfDay === 'Saturday',
            );
            const SundayVideos = responseJson.data.filter(
              x => x.dataOfDay === 'Sunday',
            );
            if (MondayVideos.length != 0) {
              setVmon(MondayVideos[0].totalVideos);
            }
            if (TuesdayVideos.length != 0) {
              setVtue(TuesdayVideos[0].totalVideos);
            }
            if (WednesdayVideos.length != 0) {
              setVwed(WednesdayVideos[0].totalVideos);
            }
            if (ThursdayVideos.length != 0) {
              setVthu(ThursdayVideos[0].totalVideos);
            }
            if (FridayVideos.length != 0) {
              setVfri(FridayVideos[0].totalVideos);
            }
            if (SaturdayVideos.length != 0) {
              setVsat(SaturdayVideos[0].totalVideos);
            }
            if (SundayVideos.length != 0) {
              setVsun(SundayVideos[0].totalVideos);
            }
            if (MondayVideos.length != 0) {
              setAmon(MondayVideos[0].totalAllies);
            }
            if (TuesdayVideos.length != 0) {
              setAtue(TuesdayVideos[0].totalAllies);
            }
            if (WednesdayVideos.length != 0) {
              setAwed(WednesdayVideos[0].totalAllies);
            }
            if (ThursdayVideos.length != 0) {
              setAthu(ThursdayVideos[0].totalAllies);
            }
            if (FridayVideos.length != 0) {
              setAfri(FridayVideos[0].totalAllies);
            }
            if (SaturdayVideos.length != 0) {
              setAsat(SaturdayVideos[0].totalAllies);
            }
            if (SundayVideos.length != 0) {
              setAsun(SundayVideos[0].totalAllies);
            }
            setOrganization(
              responseJson.data.reduce(
                (accumulator, current) => accumulator + current.totalAllies,
                0,
              ),
            );
            setCampaign(
              responseJson.data.reduce(
                (accumulator, current) => accumulator + current.totalVideos,
                0,
              ),
            );

            // console.log('graphLabelMonthx ' + graphLabelMonthx);
          }
        })
        .catch(error => {
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
          console.error('service error', error);
        });
      console.disableYellowBox = true;
    });
  }
  //  console.error('labelNameGraph ', labelNameGraph);
  // console.error('graphValueTotal ', graphValueTotal);
  // var filteredItem = graphValueTotal.map(item => item.newCompaigns);
  // console.error('filteredItem ', filteredItem);
  const data = {
    datasets: [
      //{data: [graphLabelMonthx] }
      //{data:[graphValueTotal]}
      //{data: [fundsAmountGraph]},
      {data: [0, 23, 39, 34]},
    ],
    labels: [labelNameGraph],
    //labels: [graphLabelMonth,graphLabelMonth1,graphLabelMonth2,]
    //labels: [ "WA","Massage","Twitter","FB","Email","SMS",]
  };

  /***************************************************** View *************************************************************/
  return (
    <View style={styles.container}>
      <View style={styles.DivMain}>
        <View style={styles.ChartMainView}>
          <View style={styles.graphview}>
            <View style={styles.CircleDetailview}>
              <View style={styles.DetailView}>
                <View style={styles.DetailViewTitle}>
                  <Text style={styles.ViewTitle}>{' Current Volume'}</Text>
                  <Icon
                    onPress={() => SaleSummary()}
                    name={'arrow-up'}
                    style={styles.ViewTitleIcon}
                  />
                </View>
                <Text style={styles.availableLable}>
                  {parseFloat(currentVolume)
                    .toFixed(1)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                </Text>
              </View>
              <View style={styles.DetailView}>
                <View style={styles.DetailViewTitle}>
                  <Text style={styles.ViewTitle}>
                    {' Sales of current month'}
                  </Text>
                  <Icon name={'arrow-up'} style={styles.ViewTitleIcon} />
                </View>
                <Text style={styles.availableLable}>
                  {parseFloat(currentMonthData)
                    .toFixed(1)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                </Text>
              </View>
            </View>
            <View style={styles.circleview}>
              {/* <ProgressCircle
                percent={percent}
                radius={60}
                borderWidth={12}
                color={colors.BlazorbuttonOpacity}
                shadowColor="#999"
                bgColor={colors.PagePanelTab}
              >
                <Text style={{fontSize: 20, color: colors.TextColorOther}}>
                  {percent + '%'}
                </Text>
              </ProgressCircle> */}
            </View>
          </View>
          {DashboardSummaryDisabled == false ? (
            <View style={styles.ChartView}>
              <LineChart
                data={data}
                bezier
                width={Dimensions.get('window').width - 28}
                height={Dimensions.get('window').height - 260}
                chartConfig={{
                  backgroundGradientToOpacity: 0.6,
                  backgroundGradientFromOpacity: 1,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  backgroundGradientFrom: colors.PagePanelTab,
                  backgroundGradientTo: colors.PagePanelTab,
                }}
              />
            </View>
          ) : (
            <View style={styles.BottomView}>
              <View style={styles.DashboardTitleView}>
                <Text style={styles.DashboardTitle}>Dashboard Summary</Text>
                <Icon name={'arrow-up'} style={styles.DashboardIcon} />
              </View>
              <View style={styles.TitleValue}>
                <Text style={styles.Title}>Total Campaign:</Text>
                <Text style={styles.Value}>{Campaign}</Text>
              </View>
              <View style={styles.TitleValue}>
                <Text style={styles.Title}>Inprogress:</Text>
                <Text style={styles.Value}>{Campaign}</Text>
              </View>
              <View style={styles.TitleValue}>
                <Text style={styles.Title}>Close Campaign:</Text>
                <Text style={styles.Value}>{Campaign}</Text>
              </View>
              <View style={styles.TitleValue}>
                <Text style={styles.Title}>Budget Total:</Text>
                <Text style={styles.Value}>{Organization}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
/************************************************** styles ************************************************************/
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  DivMain: {
    width: 100 + '%',
    height: 100 + '%',
    //backgroundColor: 'white',
    //backgroundColor:'rgb(255, 255, 255)',
    borderRadius: 8,
  },
  DashboardTitle: {
    fontSize: 20,
    width: 90 + '%',
    // backgroundColor:'red',
    color: colors.TextColorOther,
  },
  DashboardIcon: {
    fontSize: 31,
    width: 10 + '%',
  },
  DashboardTitleView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Title: {
    marginTop: 1,
    fontSize: 20,
    width: 48 + '%',
    color: colors.TextColorOther,
  },
  Value: {
    color: colors.TextColorOther,
    marginTop: 1,
    fontSize: 20,
    width: 48 + '%',
    textAlign: 'right',
  },
  TitleValue: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  CommentsTitle: {
    flexDirection: 'row',
    // marginLeft:15 + '%',
    justifyContent: 'space-around',
  },
  ChartMainView: {
    // width: 100 + '%',
    width: Dimensions.get('window').width,
    height: 100 + '%',
    //backgroundColor:'red',
    //padding:10,
    //marginTop:'8%',
  },
  ChartView: {
    borderColor: colors.borderColor,
    padding: 4,
    marginHorizontal: 10,
    height: Dimensions.get('window').height - 250,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: colors.PagePanelTab,
    //backgroundColor: colors.PagePanelTab,
    elevation: 5,
    //paddingLeft:-40,
    paddingLeft: -40,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.8,
  },
  BottomView: {
    paddingHorizontal: 12,
    paddingTop: 4,
    marginTop: 12,
    margin: 2,
    borderRadius: 7,
    paddingBottom: 14,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.8,
  },
  graphview: {
    flexDirection: 'row',
    //width: 96 + '%',
    //height:45 + '%',
    // borderBottomWidth:0.3,
    //borderBottomColor: 'gray',
    paddingBottom: 10,
  },
  DetailViewTitle: {
    flexDirection: 'row',
  },
  CircleDetailview: {
    width: 63 + '%',
    //backgroundColor:'blue',
    //justifyContent: 'center',
  },
  circleview: {
    width: 35 + '%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    borderRadius: 6,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.8,
  },
  DetailView: {
    // alignItems: 'center',
    padding: 4,
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: 12,
    borderRadius: 6,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.8,
    //justifyContent: 'center',
  },
  Volumelable: {
    fontSize: 16,
    color: colors.TextColorOther,
    marginTop: 1 + '%',
    textAlign: 'left',
  },
  ViewTitle: {
    fontSize: 16,
    color: colors.TextColorOther,
    marginTop: 1 + '%',
    width: 80 + '%',
    textAlign: 'left',
  },
  ViewTitleIcon: {
    fontSize: 22,
    color: colors.TextColorOther,
    marginTop: 1 + '%',
    width: 20 + '%',
    textAlign: 'right',
  },
  availableLable: {
    color: colors.TextColorOther,
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 0,
    marginLeft: 2 + '%',
    marginTop: 1 + '%',
    textAlign: 'center',
  },
});
