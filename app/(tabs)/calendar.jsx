import { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

const photos = [
  { id: "1", uri: "https://static.aujardin.info/img/img9/malus.jpg", date: "2025-09-01" },
  { id: "2", uri: "https://images.ctfassets.net/b85ozb2q358o/oTUXkOareUEXOOtOfORer/fb08e1cbe2a6ca0afdf0e19081744ac3/pommier-1.jpg", date: "2025-09-01" },
  { id: "3", uri: "https://images.ctfassets.net/b85ozb2q358o/34acdd126fba8f5a92db312da65c33324a98cb907326c4cf3800c8e270e1a25a/39a559b1089964d92303b3ce3e20fdd9/image.png", date: "2025-09-02" },
];

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState("null");

  const markedDates = photos.reduce((acc, photo) => {
    acc[photo.date] = { marked: true, dotColor: "blue" };
    return acc;
  }, {});


  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || {}),
      selected: true,
      selectedColor: "green",
    };
  }

  const filteredPhotos = selectedDate
    ? photos.filter((p) => p.date === selectedDate)
    : [];

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          console.log(" date cliquée : ", day.dateString);
          setSelectedDate(day.dateString)}

        }
      />

      <View style={styles.listContainer}>
        {selectedDate ? (
          <>
            <Text style={styles.title}>
              Photos du {selectedDate} ({filteredPhotos.length})
            </Text>
            <FlatList
              data={filteredPhotos}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={({ item }) => (
                <Image source={{ uri: item.uri }} style={styles.photo} />
              )}
            />
          </>
        ) : (
          <Text style={styles.title}>Sélectionne une date</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  photo: {
    width: 150,
    height: 150,
    margin: 5,
    borderRadius: 8,
  },
});
