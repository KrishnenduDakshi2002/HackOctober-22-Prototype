import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  StatusBar,
  SafeAreaView,
  Pressable,
  ScrollView,
  FlatList,
} from "react-native";
import HomeHeaderComponent from "../components/molecules/homeHeader.component";
import { _colors_ } from "../styles/colors";

import { EventData } from "../data/homeScreen.data";
import HomeEventItemComponent from "../components/atoms/homeEventItem.component";
import SearchBarComponent from "../components/atoms/searchBar.component";
import { useFilterState } from "../contexts/filterContext";


import { EVENT_STATUS,EVENT_MODE,EVENT_TYPE } from "../utils/filterCheckBoxReducer";

const renderItemFunction = ({ item, index, seperator }) => {
  return (
    <HomeEventItemComponent
      eventName={item.eventName}
      startTime={item.startTime}
      endTime={item.endTime}
      startDate={item.startDate}
      endDate={item.endDate}
      status={item.status}
    />
  );
};

// handling filters
const HandleFilters = (state,array) => {
    const trueEventsKeys = [];
    for(const [key,value] of Object.entries(state)){
        if(value) trueEventsKeys.push(key);  // if value is true push that filter
    }

    if(trueEventsKeys.length > 0){
        return array.filter(event => {
            const mode = event.mode.toLowerCase();
            const status = event.status.toLowerCase();
            const type = event.type.toLowerCase();
    
            return trueEventsKeys.includes(mode) || trueEventsKeys.includes(type) || trueEventsKeys.includes(status)
        })

    }else return array;

};

const HomeScreen = ({ navigation, route }) => {
  const { styles } = useStyles();
  const [searchText, setSearchText] = useState(""); // storing our search query
  const [events, _] = useState(EventData); // storing the events

  const state = useFilterState(); // this is the state from searchFilter screen
  // and will be used for filtering out evnets
    // console.log("Printing filter state [homescreen]->",state);


  // handling search
  let filteredEvents = useMemo(() => {
    return events.filter((event) => {
      return event.eventName.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [events,searchText]);  // only re-render when events or searchtext changes

  filteredEvents = useMemo(()=>HandleFilters(state,events),[state,events]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" translucent={false} />
      <HomeHeaderComponent navigation={navigation} />
      <SearchBarComponent
        navigation={navigation}
        searchedValue={searchText}
        handleSearchText={(text) => setSearchText(text)}
      />

      <FlatList
        data={filteredEvents}
        renderItem={renderItemFunction}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const useStyles = () => {
  const { width, height } = useWindowDimensions();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: _colors_.light_grey,
    },

    listContainer: {
      width: width,
    },
  });
  return { styles };
};

export default HomeScreen;