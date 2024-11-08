import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as SQLite from "expo-sqlite";
import * as ImagePicker from "expo-image-picker";

// Abrir la base de datos
const openDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("events.db");
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      date TEXT,
      photo TEXT
    );
  `);
  return db;
};

const EmergencyApp = () => {
  const [db, setDb] = useState(null);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [photo, setPhoto] = useState(null);
  const [editingEventId, setEditingEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      const database = await openDatabase();
      setDb(database);
      fetchEvents(database);
    };
    initializeDatabase();
  }, []);

  const fetchEvents = useCallback(async (database) => {
    const allRows = await database.getAllAsync("SELECT * FROM events");
    setEvents(allRows);
  }, []);

  const addEvent = useCallback(async () => {
    if (!title || !date || !photo) {
      return Alert.alert("El título, la fecha y la foto son obligatorios.");
    }

    const result = await db.runAsync(
      "INSERT INTO events (title, description, date, photo) VALUES (?, ?, ?, ?)",
      [title, description, date, photo]
    );
    setEvents([
      ...events,
      { id: result.lastInsertRowId, title, description, date, photo },
    ]);
    setTitle("");
    setDescription("");
    setDate("");
    setPhoto(null);
  }, [title, description, date, photo, events, db]);

  const updateEvent = useCallback(async () => {
    if (!title || !date || !photo) {
      return Alert.alert("El título, la fecha y la foto son obligatorios.");
    }

    await db.runAsync(
      "UPDATE events SET title = ?, description = ?, date = ?, photo = ? WHERE id = ?",
      [title, description, date, photo, editingEventId]
    );
    setEvents(
      events.map((event) =>
        event.id === editingEventId
          ? { id: event.id, title, description, date, photo }
          : event
      )
    );
    setTitle("");
    setDescription("");
    setDate("");
    setPhoto(null);
    setEditingEventId(null);
  }, [title, description, date, photo, editingEventId, events, db]);

  const deleteEvent = useCallback(
    async (id) => {
      await db.runAsync("DELETE FROM events WHERE id = ?", [id]);
      setEvents(events.filter((event) => event.id !== id));
    },
    [events, db]
  );

  const handleSubmit = useCallback(() => {
    if (editingEventId) {
      updateEvent();
    } else {
      addEvent();
    }
  }, [editingEventId, updateEvent, addEvent]);

  const selectPhoto = useCallback(async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  }, []);

  const handleEdit = useCallback((event) => {
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setPhoto(event.photo);
    setEditingEventId(event.id);
  }, []);

  const handleSelectEvent = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Título del evento"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Fecha (ej: 2024-11-07)"
        value={date}
        onChangeText={setDate}
        style={styles.input}
      />
      <Button title="Seleccionar Foto" onPress={selectPhoto} />
      {photo && <Image source={{ uri: photo }} style={styles.previewPhoto} />}

      <Button
        title={editingEventId ? "Actualizar Evento" : "Agregar Evento"}
        onPress={handleSubmit}
        color="#FF6F61"
      />

      <FlatList
        data={events}
        keyExtractor={(event) => event.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectEvent(item)}>
            <View style={styles.eventContainer}>
              <Text style={styles.eventTitle}>{item.title || "No Title"}</Text>
              <Text style={styles.eventDate}>{item.date || "No Date"}</Text>
              <Text style={styles.eventDescription}>
                {item.description || "No Description"}
              </Text>
              <View style={styles.eventButtons}>
                <Button title="Editar" onPress={() => handleEdit(item)} />
                <Button
                  title="Eliminar"
                  color="red"
                  onPress={() => deleteEvent(item.id)}
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {selectedEvent && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{selectedEvent.title}</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Image
              source={{ uri: selectedEvent.photo }}
              style={styles.eventImagePreview}
            />
          </TouchableOpacity>
          <Text style={styles.eventDetails}>{selectedEvent.description}</Text>
          <Text style={styles.eventDetails}>Fecha: {selectedEvent.date}</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setSelectedEvent(null)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Image
            source={{ uri: selectedEvent?.photo }}
            style={styles.fullScreenImage}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fafafa",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  previewPhoto: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 15,
  },
  eventContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  eventDate: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  eventDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  eventButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 5,
  },
  detailsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
    borderRadius: 20,
  },
  detailsTitle: {
    fontSize: 24,
    color: "#FF6F61",
    marginBottom: 10,
    textAlign: "center",
  },
  eventImagePreview: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventDetails: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#FF6F61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 10,
  },
});

export default EmergencyApp;
