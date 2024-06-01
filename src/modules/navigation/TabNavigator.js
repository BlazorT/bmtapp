import HomeScreen from '../home/HomeViewContainer';
import PagesScreen from '../pages/PagesViewContainer';

import AboutScreen from '../about/AboutViewContainer';
//import CampaignScheduleScreen from '../../modules/campaignSchedule/CampaignScheduleViewContainer';
import compaign from '../../../assets/images/drawer/compaign.png';
import iconPages from '../../../assets/images/drawer/grids.png';
import iconHome from '../../../assets/images/drawer/home.png';
import iconAbout from '../../../assets/images/drawer/pencil.png';
import CampaignScheduleScreen from '../../modules/mycampaign/mycampaignViewContainer';

const TabNavigator = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: iconHome,
  },
  {
    name: 'Campaigns',
    component: CampaignScheduleScreen,
    icon: compaign,
  },
  {
    name: 'Panel',
    component: PagesScreen,
    icon: iconPages,
  },
  {
    name: 'About',
    component: AboutScreen,
    icon: iconAbout,
  },
];
export default TabNavigator;
/* {
    name: 'Video',
    component: LoginScreen,
    icon: iconCalendar,
  },*/
