import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Animated,
} from "react-native";

/* CATEGORY SETTINGS */
const categories = {
  Political: {
    color: "#FF3B30",
    description: "Government, policies, civic discussions",
  },
  Health: {
    color: "#34C759",
    description: "Medical, wellness, public health",
  },
  Educational: {
    color: "#007AFF",
    description: "Knowledge, learning, philosophy",
  },
  Sports: {
    color: "#FF9500",
    description: "Sports events and activities",
  },
  Religious: {
    color: "#AF52DE",
    description: "Faith and spiritual content",
  },
  Entertainment: {
    color: "#FF2D55",
    description: "Music, movies, fun content",
  },
  Personal: {
    color: "#5AC8FA",
    description: "Personal life and updates",
  },
  PublicInfo: {
    color: "#FFD60A",
    description: "Important public announcements",
  },
  Development: {
    color: "#30D158",
    description: "Socioeconomic and development matters",
  },
  Other: {
    color: "#8E8E93",
    description: "Any content outside listed categories",
  },
};

export default function CreatePost() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [content, setContent] = useState("");
  const [otherSpecification, setOtherSpecification] = useState("");
  const [location, setLocation] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [showPreview, setShowPreview] = useState(false);

  const fadeAnim = useState(new Animated.Value(0))[0];

  /* CATEGORY SELECTION */
  const selectCategory = (cat: string) => {
    setSelectedCategory(cat);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  /* VALIDATION RULES */
  const validatePost = () => {
    if (!selectedCategory) {
      Alert.alert("Select Category");
      return false;
    }

    if (selectedCategory === "Other" && !otherSpecification.trim()) {
      Alert.alert("Specify Other Category");
      return false;
    }

    if (!content.trim()) {
      Alert.alert("Post cannot be empty");
      return false;
    }

    return true;
  };

  /* SAVE DRAFT */
  const saveDraft = () => {
    Alert.alert("Draft Saved (Temporary Frontend Draft)");
  };

  /* CONFIRM POST */
  const submitPost = () => {
    if (!validatePost()) return;

    Alert.alert("Post Published Successfully");

    setContent("");
    setSelectedCategory("");
    setOtherSpecification("");
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* USER INFO PLACEHOLDER */}
      <Text style={styles.userInfo}>Posting as Dennis</Text>

      <Text style={styles.title}>Create New Post</Text>

      {/* CATEGORY SELECTION */}
      <Text style={styles.label}>Select Category *</Text>

      <View style={styles.categoryContainer}>
        {Object.keys(categories).map((cat) => (
          <TouchableOpacity
            key={cat}
            accessibilityLabel={`Select ${cat} category`}
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  selectedCategory === cat
                    ? categories[cat].color
                    : "#E5E5EA",
              },
            ]}
            onPress={() => selectCategory(cat)}
          >
            <Text
              style={{
                color: selectedCategory === cat ? "white" : "black",
              }}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* TOOLTIP */}
      {selectedCategory ? (
        <Animated.Text
          style={{
            opacity: fadeAnim,
            color: categories[selectedCategory].color,
            marginBottom: 10,
          }}
        >
          {categories[selectedCategory].description}
        </Animated.Text>
      ) : null}

      {/* OTHER CATEGORY SPECIFICATION */}
      {selectedCategory === "Other" && (
        <TextInput
          placeholder="Specify type of post"
          style={styles.input}
          value={otherSpecification}
          onChangeText={setOtherSpecification}
        />
      )}

      {/* POST CONTENT */}
      <Text style={styles.label}>Write Post</Text>

      <TextInput
        style={styles.input}
        multiline
        value={content}
        onChangeText={setContent}
        placeholder="What's on your mind?"
      />

      {/* CHARACTER COUNTER */}
      <Text>{content.length}/500</Text>

      {/* LOCATION */}
      <TextInput
        placeholder="Add Location"
        style={styles.input}
        value={location}
        onChangeText={setLocation}
      />

      {/* HASHTAGS */}
      <TextInput
        placeholder="Add Hashtags (#example)"
        style={styles.input}
        value={hashtags}
        onChangeText={setHashtags}
      />

      {/* VISIBILITY SETTINGS */}
      <Text style={styles.label}>Visibility</Text>

      <View style={styles.visibilityRow}>
        {["Public", "Followers", "Private"].map((v) => (
          <TouchableOpacity
            key={v}
            style={[
              styles.visibilityButton,
              visibility === v && styles.visibilitySelected,
            ]}
            onPress={() => setVisibility(v)}
          >
            <Text>{v}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PREVIEW BUTTON */}
      <TouchableOpacity
        style={styles.previewButton}
        onPress={() => setShowPreview(!showPreview)}
      >
        <Text style={{ color: "white" }}>Preview</Text>
      </TouchableOpacity>

      {/* PREVIEW PANEL */}
      {showPreview && (
        <View style={styles.previewBox}>
          <Text>Category: {selectedCategory}</Text>
          {selectedCategory === "Other" && (
            <Text>Specified: {otherSpecification}</Text>
          )}
          <Text>{content}</Text>
          <Text>Location: {location}</Text>
          <Text>Hashtags: {hashtags}</Text>
          <Text>Visibility: {visibility}</Text>
        </View>
      )}

      {/* DRAFT */}
      <TouchableOpacity style={styles.draftButton} onPress={saveDraft}>
        <Text style={{ color: "white" }}>Save Draft</Text>
      </TouchableOpacity>

      {/* POST */}
      <TouchableOpacity style={styles.postButton} onPress={submitPost}>
        <Text style={{ color: "white" }}>POST</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#F2F2F7",
  },
  userInfo: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  categoryButton: {
    padding: 8,
    borderRadius: 20,
    margin: 4,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  visibilityRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  visibilityButton: {
    padding: 10,
    backgroundColor: "#E5E5EA",
    marginRight: 10,
    borderRadius: 10,
  },
  visibilitySelected: {
    backgroundColor: "#007AFF",
  },
  previewButton: {
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  previewBox: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  draftButton: {
    backgroundColor: "#8E8E93",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  postButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});
