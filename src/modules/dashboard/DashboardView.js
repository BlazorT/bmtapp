import React, { useEffect, useState } from 'react';
import { Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/EvilIcons';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import { colors } from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import moment from 'moment';
export default function DashboardScreen(props) {
  const theme = useTheme();
  const { user } = useUser();
  const [dashboardSaleSummary, setDashboardSaleSummary] = useState(false);
  const [spinner, setspinner] = useState(false);

  const [data, setData] = useState({
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }],
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    totalCampaigns: 0,
    totalBudget: 0,
    percentageIncrease: 0,
    currentMonthVol: 0,
    currMonthSales: 0,
    inProgress: 0,
    closeCompains: 0,
  });

  /**************************************************** useEffect **************************************************************/
  useEffect(() => {
    fetchDashboardData();
  }, []);

  //DashboardCall(() => {
  function saleSummaryToggle() {
    setDashboardSaleSummary(!dashboardSaleSummary);
  }
  const fetchDashboardData = async () => {
    setspinner(true);
    try {
      const headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          orgId: user.orgId,
          status: 1,
          id: 0,
          // DataOfMonth: '',
          CreatedAt: moment.utc().subtract(100, 'year').format(),
          RowVer: 1,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      console.log({ headerFetch });
      // /dashboard
      const response = await fetch(
        `${servicesettings.baseuri}Compaigns/GetDashboardData`,
        headerFetch,
      );
      console.log({ response });
      if (!response.ok) {
        const error = new Error(
          `HTTP error! Status: ${response.status}, Message: ${response.statusText}`,
        );
        error.status = response.status; // Attach status to the error object
        throw error;
      }
      const responseJson = await response.json();
      console.log(responseJson.data);
      if (responseJson.data) {
        // Map total campaigns to months
        const DashboardData = responseJson.data;
        const labels = DashboardData.map(item => item.dataOfMonth);
        const totalCampaigns = DashboardData.map(item => item.totalCompaigns);
        const newCompaigns = DashboardData.map(item => item.newCompaigns);
        const totalNumberCampaigns = totalCampaigns.reduce(
          (acc, curr) => acc + curr,
          0,
        );
        const inProgress = newCompaigns.reduce((acc, curr) => acc + curr, 0);
        const totalBudget = DashboardData.map(item => item.fundsAmount).reduce(
          (acc, curr) => acc + curr,
          0,
        );

        const percentageIncrease = Math.round(
          (DashboardData[0].percentageIncrease / 100) * 100,
        );
        const currentMonthVol = DashboardData[0].newCompaigns;
        const currentMonthSales = DashboardData[0].fundsAmount;

        console.log({ percentageIncrease });
        // Update state with the mapped data
        setData({
          datasets: [{ data: totalCampaigns }],
          labels: labels,
          totalCampaigns: totalNumberCampaigns,
          totalBudget: totalBudget,
          percentageIncrease: parseInt(percentageIncrease),
          currentMonthVol: currentMonthVol,
          currMonthSales: currentMonthSales,
          inProgress: inProgress,
          closeCompains: totalNumberCampaigns - inProgress,
        });
        setspinner(false);
      }
    } catch (error) {
      console.error(error);
      setspinner(false);
      Toast.show('error occured, try another time !!!', Toast.LONG);
    }
  };

  /***************************************************** View *************************************************************/
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Spinner visible={spinner} textContent={'Loading...'} />
      <View style={styles.DivMain}>
        <View style={styles.ChartMainView}>
          <View style={styles.graphview}>
            <View style={styles.CircleDetailview}>
              <View
                style={[
                  styles.DetailView,
                  { backgroundColor: theme.cardBackColor },
                ]}
              >
                <View style={styles.DetailViewTitle}>
                  <Text style={[styles.ViewTitle, { color: theme.textColor }]}>
                    {' Current Volume'}
                  </Text>
                  <Icon
                    onPress={() => saleSummaryToggle()}
                    name={'arrow-up'}
                    style={[styles.ViewTitleIcon, { color: theme.tintColor }]}
                  />
                </View>
                <Text
                  style={[styles.availableLable, { color: theme.textColor }]}
                >
                  {parseFloat(data.currentMonthVol)
                    .toFixed(1)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                </Text>
              </View>
              <View
                style={[
                  styles.DetailView,
                  { backgroundColor: theme.cardBackColor },
                ]}
              >
                <View style={styles.DetailViewTitle}>
                  <Text style={[styles.ViewTitle, { color: theme.textColor }]}>
                    {' Sales of current month'}
                  </Text>
                  <Icon
                    name={'arrow-up'}
                    style={[styles.ViewTitleIcon, { color: theme.tintColor }]}
                  />
                </View>
                <Text
                  style={[styles.availableLable, { color: theme.textColor }]}
                >
                  {parseFloat(data.currMonthSales)
                    .toFixed(1)
                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.circleview,
                { backgroundColor: theme.cardBackColor },
              ]}
            >
              <AnimatedCircularProgress
                size={120}
                width={15}
                rotation={360}
                delay={500}
                prefill={0}
                fillLineCap="round"
                easing={Easing.out(Easing.ease)}
                fill={data.percentageIncrease}
                tintColor={theme.buttonBackColor}
                backgroundColor={theme.backgroundColor}
              >
                {fill => (
                  <Text style={{ fontSize: 30, color: theme.textColor }}>
                    {fill.toFixed(0) + '%'}
                  </Text>
                )}
              </AnimatedCircularProgress>
            </View>
          </View>
          {dashboardSaleSummary == false ? (
            <View
              style={[
                styles.ChartView,
                { backgroundColor: theme.cardBackColor },
              ]}
            >
              <LineChart
                data={data}
                bezier
                width={Dimensions.get('window').width - 28}
                height={Dimensions.get('window').height - 350}
                chartConfig={{
                  backgroundGradientToOpacity: 0.6,
                  backgroundGradientFromOpacity: 1,
                  decimalPlaces: 0,
                  color: (opacity = 1) => theme.tintColor,
                  backgroundGradientFrom: theme.cardBackColor,
                  backgroundGradientTo: theme.cardBackColor,
                }}
              />
            </View>
          ) : (
            <View
              style={[
                styles.BottomView,
                { backgroundColor: theme.cardBackColor },
              ]}
            >
              <View style={styles.DashboardTitleView}>
                <Text
                  style={[styles.DashboardTitle, { color: theme.textColor }]}
                >
                  Dashboard Summary
                </Text>
                <Icon
                  name={'arrow-up'}
                  style={[styles.DashboardIcon, { color: theme.tintColor }]}
                />
              </View>
              <View style={styles.TitleValue}>
                <Text style={[styles.Title, { color: theme.textColor }]}>
                  Total Campaign:
                </Text>
                <Text style={[styles.Value, { color: theme.textColor }]}>
                  {data.totalCampaigns}
                </Text>
              </View>
              <View style={styles.TitleValue}>
                <Text style={[styles.Title, { color: theme.textColor }]}>
                  Inprogress:
                </Text>
                <Text style={[styles.Value, { color: theme.textColor }]}>
                  {data.inProgress}
                </Text>
              </View>
              <View style={styles.TitleValue}>
                <Text style={[styles.Title, { color: theme.textColor }]}>
                  Close Campaign:
                </Text>
                <Text style={[styles.Value, { color: theme.textColor }]}>
                  {data.closeCompains}
                </Text>
              </View>
              <View style={styles.TitleValue}>
                <Text style={[styles.Title, { color: theme.textColor }]}>
                  Budget Total:
                </Text>
                <Text style={[styles.Value, { color: theme.textColor }]}>
                  {data.totalBudget}
                </Text>
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
    // height: Dimensions.get('window').height - 250,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: colors.PagePanelTab,
    //backgroundColor: colors.PagePanelTab,
    elevation: 5,
    //paddingLeft:-40,
    // paddingLeft: -40,
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 6 },
    shadowOpacity: 0.8,
  },
  BottomView: {
    marginHorizontal: 12,
    paddingHorizontal: 6,
    paddingTop: 4,
    marginTop: 12,
    margin: 2,
    borderRadius: 7,
    paddingBottom: 14,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 6 },
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
    shadowOffset: { width: 4, height: 6 },
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
    shadowOffset: { width: 4, height: 6 },
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
