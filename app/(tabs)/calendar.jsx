import { backAPI } from "@/services/api";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function CalendarScreen() {
  const [photos, setPhotos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Charger les photos quand l'écran est focus
  useFocusEffect(
    useCallback(() => {
      console.log("CalendarScreen focus → rechargement des photos");
      loadPhotos();
    }, [])
  );

  const loadPhotos = async () => {
    try {
      const data = await backAPI.getAllPhotosByDate(); // renvoie la liste d’objets
      console.log("Photos brutes :", data);
  
      const normalized = data.map((photo) => {
        const date = new Date(photo.date).toISOString().split('T')[0]; // format AAAA-MM-JJ
        return {
          id: photo.id,
          date: date,
          url: photo.url,
        };
      }); 
  
      console.log("Photos normalisées :", normalized);
      setPhotos(normalized);
    } catch (err) {
      console.log("Erreur chargement photos:", err);
    }
  };
  

  const markedDates = photos.reduce((acc, photo) => {
  if (!acc[photo.date]) {
    acc[photo.date] = { markedDates: true, dotColor: "blue", count: 1 };
  } else {
    acc[photo.date].count += 1;
  }
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
  ? photos.filter((p) => {
      const isMatch = p.date === selectedDate;
      console.log(`Filtrage: photo date ${p.date}, selected date ${selectedDate}, match: ${isMatch}`);
      return isMatch;
    })
  : [];

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        markedDates={markedDates}
        onDayPress={(day) => {
          console.log("Date sélectionnée :", day.dateString);
          setSelectedDate(day.dateString);
        }}
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
                <Image source={{ uri: item.url }} style={styles.photo} />
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
