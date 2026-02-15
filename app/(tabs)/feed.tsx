import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
} from "react-native";
import { usePosts } from "../../context/PostsContext";
import { CATEGORIES } from "../../constants/categories";

// -----------------------------
// ✅ Comment type
// -----------------------------
export type Comment = {
  id: string;
  user: { name: string; avatar: string };
  text: string;
  likes?: number;
  liked?: boolean;
  replies?: Comment[];
};

// -----------------------------
// ✅ CommentThread Component
// -----------------------------
interface CommentThreadProps {
  comment: Comment;
  level?: number;
}

export const CommentThread: React.FC<CommentThreadProps> = ({ comment, level = 0 }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [liked, setLiked] = useState(comment.liked ?? false);
  const [likesCount, setLikesCount] = useState(comment.likes ?? 0);

  const verticalAnim = useRef(new Animated.Value(0)).current;
  const horizontalAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const toggleReply = () => {
    setShowReplyBox(!showReplyBox);
    Animated.parallel([
      Animated.spring(verticalAnim, { toValue: showReplyBox ? 0 : 1, useNativeDriver: false, stiffness: 120, damping: 15 }),
      Animated.spring(horizontalAnim, { toValue: showReplyBox ? 0 : 1, useNativeDriver: false, stiffness: 120, damping: 15 }),
    ]).start();
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const verticalHeight = verticalAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] });
  const horizontalWidth = horizontalAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });

  return (
    <View style={{ flexDirection: "row", marginLeft: level * 20, marginVertical: 6 }}>
      <View style={{ alignItems: "center" }}>
        <Image source={{ uri: comment.user.avatar }} style={styles.commentAvatar} />
        {showReplyBox && <Animated.View style={{ width: 2, height: verticalHeight, backgroundColor: "#888", marginTop: 2 }} />}
      </View>

      <View style={{ marginLeft: 8, flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {showReplyBox && <Animated.View style={{ width: horizontalWidth, height: 2, backgroundColor: "#888", marginRight: 4 }} />}
          <Text style={styles.commentText}>{comment.text}</Text>

          {/* Comment Button */}
          <TouchableOpacity onPress={toggleReply} style={styles.commentButton}>
            <Text style={styles.commentButtonText}>💬</Text>
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity onPress={toggleLike} style={{ marginLeft: 6 }}>
            <Animated.Text style={{ transform: [{ scale: scaleAnim }], color: liked ? "pink" : "white", fontSize: 16 }}>
              ❤️ {likesCount}
            </Animated.Text>
          </TouchableOpacity>
        </View>

        {showReplyBox &&
          comment.replies?.map((reply) => <CommentThread key={reply.id} comment={reply} level={level + 1} />)}
      </View>
    </View>
  );
};

// -----------------------------
// ✅ Post Item Component
// -----------------------------
const PostItem = ({ item, index, newPostIds, livePulseAnim, liveBlink }) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(newPostIds.has(index) ? 1 : 0)).current;
  const [liked, setLiked] = useState(item.liked ?? false);
  const [likesCount, setLikesCount] = useState(item.likes ?? 0);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isLive = !!item.liveStartTime;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 900, useNativeDriver: false }),
      ]),
    ]).start();
  }, [newPostIds]);

  const getLiveTimer = (startTime?: number) => {
    if (!startTime) return "";
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleLike = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.5, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  };

  const categoryLabel =
    item.category === "others" && item.otherCategoryText
      ? `${item.otherCategoryText} Post`
      : `${CATEGORIES[item.category ?? ""]?.label ?? "Unknown"} Post`;

  const categoryColor =
    item.category === "others"
      ? CATEGORIES["others"].color
      : CATEGORIES[item.category ?? ""]?.color ?? "#888";

  const glowBackground = glowAnim.interpolate({ inputRange: [0, 1], outputRange: ["#fff", "rgba(255,255,0,0.3)"] });
  const livePulse = livePulseAnim.interpolate({ inputRange: [0, 1], outputRange: ["rgba(255,0,0,0.1)", "rgba(255,0,0,0.3)"] });

  return (
    <Animated.View
      style={[styles.postCard, { transform: [{ translateY: slideAnim }], opacity: opacityAnim, backgroundColor: glowBackground }]}
    >
      {/* User info and category */}
      <View style={styles.userRow}>
        <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{item.user.name}</Text>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]} />
        <Text style={{ marginLeft: 6, color: categoryColor, fontWeight: "bold" }}>{categoryLabel}</Text>
      </View>

      {/* Post text */}
      <Text style={{ marginVertical: 4 }}>{item.text}</Text>

      {/* Media */}
      <FlatList
        data={item.mediaUris}
        horizontal
        keyExtractor={(uri) => uri}
        renderItem={({ item: uri }) => (
          <View>
            <Image source={{ uri }} style={styles.mediaPreview} />
            {isLive && (
              <Animated.View style={[styles.liveBadge, { backgroundColor: livePulse }]}>
                <Text style={{ color: liveBlink ? "red" : "#fff", fontWeight: "bold" }}>
                  LIVE {getLiveTimer(item.liveStartTime)}
                </Text>
              </Animated.View>
            )}
          </View>
        )}
      />

      {item.audioUri && <Text>Audio: {item.audioUri}</Text>}
      <Text style={styles.infoText}>Hashtags: {item.hashtags}</Text>
      <Text style={styles.infoText}>Location: {item.location}</Text>
      <Text style={styles.infoText}>Visibility: {item.visibility}</Text>

      {/* Post Like */}
      <TouchableOpacity onPress={toggleLike} style={{ marginTop: 6 }}>
        <Animated.Text style={{ transform: [{ scale: scaleAnim }], color: liked ? "pink" : "white", fontSize: 18 }}>
          ❤️ {likesCount}
        </Animated.Text>
      </TouchableOpacity>

      {/* Comments */}
      {item.comments?.map((comment) => (
        <CommentThread key={comment.id} comment={comment} />
      ))}
    </Animated.View>
  );
};

// -----------------------------
// ✅ Feed Screen
// -----------------------------
export default function FeedScreen() {
  const { rankedPosts } = usePosts();
  const [filter, setFilter] = useState<string[]>([]);
  const scrollRef = useRef<FlatList>(null);
  const [liveBlink, setLiveBlink] = useState(true);
  const [newPostIds, setNewPostIds] = useState<Set<number>>(new Set());
  const scaleAnim = useRef(Object.fromEntries(Object.keys(CATEGORIES).map((key) => [key, new Animated.Value(1)]))).current;
  const livePulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(livePulseAnim, { toValue: 1, duration: 800, useNativeDriver: false }),
        Animated.timing(livePulseAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setLiveBlink((prev) => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollToOffset({ offset: 0, animated: true });
    setNewPostIds(new Set(rankedPosts.map((_, idx) => idx)));
    const timeout = setTimeout(() => setNewPostIds(new Set()), 1200);
    return () => clearTimeout(timeout);
  }, [rankedPosts]);

  const toggleFilter = (key: string) => {
    Animated.sequence([
      Animated.timing(scaleAnim[key], { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim[key], { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    setFilter((prev) => (prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]));
  };

  const filteredRankedPosts = useMemo(() => {
    if (filter.length === 0) return rankedPosts;
    return rankedPosts.filter((p) => filter.includes(p.category ?? ""));
  }, [rankedPosts, filter]);

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterContainer}>
        {Object.keys(CATEGORIES).map((key) => {
          const isSelected = filter.includes(key);
          return (
            <TouchableWithoutFeedback key={key} onPress={() => toggleFilter(key)}>
              <Animated.View
                style={[
                  styles.filterButton,
                  { backgroundColor: isSelected ? CATEGORIES[key].color : "#ccc", transform: [{ scale: scaleAnim[key] }] },
                ]}
              >
                <Text style={{ color: "#fff", fontWeight: isSelected ? "bold" : "normal" }}>{CATEGORIES[key].label}</Text>
                {isSelected && (
                  <View style={styles.checkCircle}>
                    <Text style={styles.checkMark}>✔</Text>
                  </View>
                )}
              </Animated.View>
            </TouchableWithoutFeedback>
          );
        })}
      </View>

      {/* Post List */}
      <FlatList
        ref={scrollRef}
        data={filteredRankedPosts}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <PostItem item={item} index={index} newPostIds={newPostIds} livePulseAnim={livePulseAnim} liveBlink={liveBlink} />
        )}
      />
    </View>
  );
}

// -----------------------------
// Styles
// -----------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  filterContainer: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8, paddingVertical: 8 },
  filterButton: { paddingHorizontal: 12, paddingVertical: 6, margin: 4, borderRadius: 6, flexDirection: "row", alignItems: "center" },
  checkCircle: { width: 16, height: 16, borderRadius: 8, backgroundColor: "#fff", marginLeft: 4, alignItems: "center", justifyContent: "center" },
  checkMark: { color: "#000", fontSize: 10, fontWeight: "bold" },
  postCard: { padding: 12, marginBottom: 12, marginHorizontal: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 },
  userRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  userName: { fontWeight: "bold" },
  mediaPreview: { width: 100, height: 100, marginRight: 8, borderRadius: 6 },
  liveBadge: { position: "absolute", top: 4, left: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  infoText: { fontSize: 12, color: "#555" },
  categoryBadge: { width: 14, height: 14, borderRadius: 7, marginLeft: 8 },

  // CommentThread styles
  commentText: { fontSize: 14, color: "#333", flexShrink: 1 },
  commentButton: { marginLeft: 6, borderWidth: 2, borderColor: "blue", borderRadius: 20, padding: 4, justifyContent: "center", alignItems: "center" },
  commentButtonText: { color: "blue", fontSize: 14, fontWeight: "bold" },
  commentAvatar: { width: 30, height: 30, borderRadius: 15 },
});