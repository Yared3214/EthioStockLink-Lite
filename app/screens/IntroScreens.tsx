import React, { useRef } from "react";
import { Dimensions, ScrollView, StyleSheet, View, ScrollView as ScrollViewType } from "react-native";
import SignUpScreen from "../(auth)/SignupScreen";
import LandingPageScreen from "./LandingPage";
import UserDetailsScreen from "./UserDetailsScreen";

const { width } = Dimensions.get("window");

export default function IntroScreens({ navigation }: any) {
  const scrollRef = useRef<ScrollViewType>(null);

  const scrollToPage = (pageIndex: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: pageIndex * width, animated: true });
    }
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >
      <View style={styles.screen}>
        <LandingPageScreen goToSignUp={() => scrollToPage(1)} />
      </View>
      <View style={styles.screen}>
        <SignUpScreen goToUserDetail ={() => scrollToPage(2)}/>
      </View>
      <View style={styles.screen}>
        <UserDetailsScreen />
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    width: width,
    flex: 1,
  },
  text: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 200,
  },
});
