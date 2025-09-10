import React from 'react';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const AppSwipeable = ({
  swipeableRef,
  renderRightActions,
  renderLeftActions,
  friction,
  children,
}) => {
  return (
    <Swipeable
      ref={swipeableRef}
      friction={friction}
      leftThreshold={50}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
    >
      {children}
    </Swipeable>
  );
};

export default AppSwipeable;
