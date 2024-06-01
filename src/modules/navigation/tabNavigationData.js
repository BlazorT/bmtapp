import HomeScreen from '../home/HomeViewContainer';
import PagesScreen from '../pages/PagesViewContainer';
//import LiveVideoVersion from '../../modules/liveVideo/LiveVideoViewContainer';

//import ArchiveVideoVersion from '../../modules/archiveVideo/ArchiveVideoViewContainer';
//import PaymentScreen from '../../modules/payment/PaymentViewContainer'
import compaign from '../../../assets/images/drawer/compaign.png';
import iconPages from '../../../assets/images/drawer/grids.png';
import iconHome from '../../../assets/images/drawer/home.png';
import mycampaignIcon from '../../../assets/images/drawer/mycampaign.png';
import iconAbout from '../../../assets/images/drawer/pencil.png';
import CampaignScheduleScreen from '../../modules/campaignSchedule/CampaignScheduleViewContainer';
import mycampaignScreen from '../../modules/mycampaign/mycampaignViewContainer';
import AboutScreen from '../about/AboutViewContainer';

const tabNavigationData = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: iconHome,
  },
  {
    name: 'Campaign (+)',
    component: CampaignScheduleScreen,
    icon: compaign,
  },
  {
    name: 'Campaigns',
    component: mycampaignScreen,
    icon: mycampaignIcon,
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
export default tabNavigationData;
