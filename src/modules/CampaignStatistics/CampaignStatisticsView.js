import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

import Spinner from 'react-native-loading-spinner-overlay';
import Icona from 'react-native-vector-icons/EvilIcons';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';

export default function CampaignStatisticsScreen() {
  const theme = useTheme();
  const user = useUser();

  const [percent, setPercent] = useState(0);
  const [spinner, setSpinner] = useState(false);
  const [dataList, setDataList] = useState({
    datasets: [{data: []}],
    labels: [],
    currentVol: 0,
    currMonthSales: 0,
  });

  useEffect(() => {
    loadStatsData();
  }, []);

  const loadStatsData = async () => {
    setSpinner(true);
    try {
      let headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          orgId: user.orgid,
          status: 1,
          name: '',
          networkId: 0,
          id: user.ordid,
          lastUpdatedBy: user.id,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      const response = await fetch(
        `${servicesettings.baseuri}mybundlings`,
        headerFetch,
      );
      const responseJson = await response.json();
      // console.log(responseJson);
      if (responseJson.status === true) {
        const stats = responseJson.data;
        const labels = stats.map(item => item.networkName);
        const data = stats.map(item => item.purchasedQouta);
        const totalVol = stats
          .map(item => item.purchasedQouta)
          .reduce((acc, curr) => acc + curr, 0);
        const currMontSale = calculateCurrentMonthSales(stats);
        const percentage = calculateOverallSalesPercentageChange(stats);
        setPercent(percentage);
        setDataList({
          datasets: [{data: data}],
          labels: labels,
          currentVol: totalVol,
          currMonthSales: currMontSale,
        });
        setSpinner(false);
      }
    } catch (error) {
      setSpinner(false);
      console.error(error);
    }
  };
  function calculateCurrentMonthSales(data) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const currentMonthItems = data.filter(item => {
      const finishTime = new Date(item.finishTime);
      return (
        finishTime.getMonth() === currentMonth &&
        finishTime.getFullYear() === currentYear
      );
    });

    // Sum up the usedQuota for the filtered items
    const currentMonthSales = currentMonthItems.reduce(
      (total, item) => total + item.purchasedQouta,
      0,
    );

    return currentMonthSales;
  }

  function calculateTotalSalesForYear(data, year) {
    const yearItems = data.filter(item => {
      const finishTime = new Date(item.finishTime);
      return finishTime.getFullYear() === year;
    });

    const totalSales = yearItems.reduce(
      (total, item) => total + item.usedQuota,
      0,
    );

    return totalSales;
  }

  function calculateOverallSalesPercentageChange(data) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;

    const currentYearSales = calculateTotalSalesForYear(data, currentYear);
    const lastYearSales = calculateTotalSalesForYear(data, lastYear);

    if (lastYearSales === 0) {
      return currentYearSales === 0 ? 0 : 100;
    }

    const percentageChange =
      ((currentYearSales - lastYearSales) / lastYearSales) * 100;
    return percentageChange;
  }
  // function CompaignDetailsCall() {
  //   var headerFetch = {
  //     method: 'POST',
  //     body: JSON.stringify({ordid: 1, status: 0, id: 0, lastUpdatedBy: 0}),
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json; charset=utf-8',
  //       Authorization: servicesettings.AuthorizationKey,
  //     },
  //   };
  //   fetch(servicesettings.baseuri + 'bmtcompaigns', headerFetch)
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       console.log(responseJson);
  //       if (responseJson.data != null) {
  //         //{"dataOfDay": "Monday", "totalAllies": 0, "totalLikes": 0, "totalVideos": 1}
  //       }
  //     })
  //     .catch(error => {
  //       Toast.showWithGravity(
  //         'Internet connection failed, try another time !!!',
  //         Toast.LONG,
  //         Toast.CENTER,
  //       );
  //       console.error('service error', error);
  //     });
  //   //console.disableYellowBox = true;
  // }
  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <Spinner visible={spinner} textContent={'Loading...'} />
      <View style={styles.graphview}>
        <View style={styles.CircleDetailview}>
          <View
            style={[styles.DetailView, {backgroundColor: theme.cardBackColor}]}>
            <View style={styles.DetailViewTitle}>
              <Text style={[styles.ViewTitle, {color: theme.textColor}]}>
                {' Current Volume'}
              </Text>
              <Icona
                name={'arrow-up'}
                style={[styles.ViewTitleIcon, {color: theme.tintColor}]}
              />
            </View>
            <Text style={[styles.availableLable, {color: theme.textColor}]}>
              {parseFloat(dataList.currentVol)
                .toFixed(1)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
          </View>
          <View
            style={[styles.DetailView, {backgroundColor: theme.cardBackColor}]}>
            <View style={styles.DetailViewTitle}>
              <Text style={[styles.ViewTitle, {color: theme.textColor}]}>
                {' Sales of current month'}
              </Text>
              <Icona
                name={'arrow-up'}
                style={[styles.ViewTitleIcon, {color: theme.tintColor}]}
              />
            </View>
            <Text style={[styles.availableLable, {color: theme.textColor}]}>
              {parseFloat(dataList.currMonthSales)
                .toFixed(1)
                .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
            </Text>
          </View>
        </View>
        <View
          style={[styles.circleview, {backgroundColor: theme.cardBackColor}]}>
          <AnimatedCircularProgress
            size={120}
            width={15}
            rotation={360}
            delay={500}
            prefill={0}
            // lineCap="square"
            fillLineCap="round"
            easing={Easing.out(Easing.ease)}
            fill={percent}
            tintColor={theme.buttonBackColor}
            backgroundColor={theme.backgroundColor}>
            {fill => (
              <Text style={{fontSize: 30, color: theme.textColor}}>
                {fill.toFixed(0) + '%'}
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
      <ScrollView horizontal>
        <BarChart
          data={dataList}
          width={2000}
          height={Dimensions.get('window').height - 320}
          chartConfig={{
            color: (opacity = 1) => theme.textColor,
            backgroundGradientFrom: theme.cardBackColor,
            backgroundGradientTo: theme.cardBackColor,
            backgroundGradientToOpacity: 1,
            backgroundGradientFromOpacity: 1,
            decimalPlaces: 0,
          }}
          fromNumber={50000}
          fromZero={false}
          // verticalLabelRotation={30}
          showValuesOnTopOfBars={true}
          bezier
          style={{
            marginHorizontal: 10,
            paddingRight: 20, // to remove white spaces at the start of the chart
          }}
        />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.BlazorBg,
    width: Dimensions.get('window').width,
  },
  OrderNumber: {
    marginLeft: 0,
    fontSize: 20,
    color: colors.TextColorOther,
  },
  Title: {
    marginTop: 1,
    fontSize: 40,
    color: colors.TextColorOther,
  },
  itemMainView: {
    borderColor: colors.borderColor,
    padding: 10,
    borderWidth: 0,
    borderRadius: 5,
  },
  ChartView: {
    borderColor: colors.borderColor,
    padding: 4,
    borderWidth: 0,
    borderRadius: 5,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    paddingLeft: -40,
    shadowColor: 'black',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.8,
  },
  graphview: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  DetailViewTitle: {
    flexDirection: 'row',
  },
  CircleDetailview: {
    width: 63 + '%',
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
  totalVolumelable: {
    fontSize: 14,
    color: colors.TextColorOther,
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
  soldLable: {
    color: colors.TextColorOther,
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop: 6 + '%',
    marginLeft: 4 + '%',
  },
});
