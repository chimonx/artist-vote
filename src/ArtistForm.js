import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Autocomplete,
  Avatar,
  ListItemAvatar,
  CircularProgress,
} from "@mui/material";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ArtistForm = () => {
  const [artistName, setArtistName] = useState("");
  const [artists, setArtists] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // ฟังก์ชันดึงข้อมูลศิลปินจาก Firebase
  const fetchArtists = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "artists"));
      const artistList = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          votes: data.votes,
          image: data.image || "", // ดึงฟิลด์ image มาด้วย
        };
      });
      setArtists(artistList);
      setOptions(artistList.map((artist) => artist.name));
    } catch (error) {
      console.error("Error fetching artists: ", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเพิ่มชื่อศิลปินลง Firebase
  const handleAddArtist = async (e) => {
    e.preventDefault();

    if (artistName.trim() === "") return;

    try {
      // ค้นหาศิลปินใน Firebase
      const existingArtistQuery = query(
        collection(db, "artists"),
        where("name", "==", artistName)
      );
      const querySnapshot = await getDocs(existingArtistQuery);

      if (!querySnapshot.empty) {
        // ถ้าศิลปินมีอยู่แล้ว ให้เพิ่ม votes
        const artistDoc = querySnapshot.docs[0];
        const artistRef = doc(db, "artists", artistDoc.id);
        await updateDoc(artistRef, {
          votes: artistDoc.data().votes + 1,
        });
      } else {
        // ถ้าศิลปินยังไม่มีใน Firebase ให้สร้างใหม่
        // สมมติว่าเรามีฟิลด์ image อยู่แล้วใน Firebase
        await addDoc(collection(db, "artists"), {
          name: artistName,
          votes: 1,
          image: "", // หรือค่าเริ่มต้นสำหรับรูปภาพ
        });
      }

      setArtistName("");
      fetchArtists();
    } catch (error) {
      console.error("Error adding artist: ", error);
    }
  };

  // เตรียมข้อมูลสำหรับ Pie Chart
  const pieData = {
    labels: artists.map((artist) => artist.name),
    datasets: [
      {
        label: "# of Votes",
        data: artists.map((artist) => artist.votes),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <Container maxWidth="md" style={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Paper elevation={3} style={{ padding: "2rem" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          เสนอชื่อศิลปิน
        </Typography>
        <form onSubmit={handleAddArtist} style={{ marginBottom: "2rem" }}>
          <Autocomplete
            freeSolo
            options={options}
            value={artistName}
            loading={loading}
            onChange={(event, newValue) => {
              setArtistName(newValue || "");
            }}
            onInputChange={(event, newInputValue) => {
              setArtistName(newInputValue || "");
            }}
            noOptionsText="ไม่พบศิลปินที่ตรงกับการค้นหา"
            renderInput={(params) => (
              <TextField
                {...params}
                label="กรอกชื่อศิลปิน"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option, { inputValue }) => {
              const artist = artists.find((artist) => artist.name === option);
              const matches = artist.name
                .toLowerCase()
                .includes(inputValue.toLowerCase());
              const parts = artist.name.split(
                new RegExp(`(${inputValue})`, "gi")
              );
              return (
                <li {...props}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        src={artist.image || "/default-avatar.png"}
                        alt={artist.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        parts.map((part, index) => (
                          <span
                            key={index}
                            style={{
                              fontWeight:
                                part.toLowerCase() === inputValue.toLowerCase()
                                  ? 700
                                  : 400,
                            }}
                          >
                            {part}
                          </span>
                        ))
                      }
                    />
                  </ListItem>
                </li>
              );
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            style={{ marginTop: "1rem" }}
          >
            เพิ่มชื่อศิลปิน
          </Button>
        </form>
        <Typography variant="h5" component="h2" gutterBottom>
          รายชื่อศิลปิน
        </Typography>
        <List>
          {artists.map((artist) => (
            <ListItem key={artist.id} divider>
              <ListItemAvatar>
                <Avatar
                  src={artist.image || "/default-avatar.png"}
                  alt={artist.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={artist.name}
                secondary={`จำนวนโหวต: ${artist.votes}`}
              />
            </ListItem>
          ))}
        </List>
        {artists.length > 0 && (
          <div style={{ marginTop: "2rem" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              สถิติการโหวต
            </Typography>
            <Pie data={pieData} />
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default ArtistForm;
