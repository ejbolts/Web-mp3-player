let songMp3;
let songDisplay;
let songName;
let songArtist;
let indexCount = 0;
let audioTime;

const jsmediatags = window.jsmediatags;
const SubmitFile = document.querySelector(".Submitfile");
const backButton = document.querySelector(".back");
const forwardButton = document.querySelector(".forward");
const img = document.querySelector(".testimg");
const MPimg = document.querySelector(".song-box-img");
const MPName = document.querySelector(".MP-name");
const MPArtist = document.querySelector(".MP-artist");
const PreviewTitle = document.querySelector(".song-info-title");
const PreviewSongArt = document.querySelector(".preview-song-art");
const PreviewArtistName = document.querySelector(".song-info-artist");
const Submitfile = document.querySelector(".Submitfile");

const audioSong = document.querySelector("audio");
audioSong.addEventListener("loadedmetadata", () => {
  // Display the duration of the audio file
  audioTime = Math.floor(audioSong.duration);
});

document.querySelector(".fileInput").addEventListener("change", function () {
  const file = this.files[0];

  // Read the file as a data URL
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    // Get the data URL of the audio file
    const dataURL = reader.result;
    // does allow user to playsong before submitted. But is needed to get song duration from source.
    audioSong.src = dataURL;
    songMp3 = dataURL;
  };

  // read mp3 file metadata to collect image and name
  jsmediatags.read(file, {
    onSuccess: function (tag) {
      console.log("tag:", tag);
      console.log("tags:", tag.tags);
      // Array buffer to base64
      const data = tag.tags.picture.data;
      const format = tag.tags.picture.format;
      songArtist = tag.tags.artist;
      songName = tag.tags.title;
      PreviewTitle.innerHTML = songName;
      MPName.innerHTML = songName;
      PreviewArtistName.innerHTML = songArtist;
      MPArtist.innerHTML = songArtist;
      Submitfile.innerHTML = `Submit: ${songName}`;
      console.log("songname:", songName);
      let base64String = "";
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }
      // Output media tags
      songDisplay = `data:${format};base64,${window.btoa(base64String)}`;
      console.log(songDisplay);
      MPimg.src = songDisplay;
      img.src = songDisplay;
      PreviewSongArt.src = songDisplay;
    },
    onError: function (error) {
      console.log(error);
    },
  });
});

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

if (!indexedDB) {
  console.log("IndexedDB could not be found in this browser.");
}
const request = indexedDB.open("SongsDatabase", 1);

request.onerror = function (event) {
  console.error("An error occurred with IndexedDB");
  console.error(event);
};

request.onupgradeneeded = function () {
  const db = request.result;
  const store = db.createObjectStore("songs", { keyPath: "id" });

  store.createIndex("song_name", ["name"], { unique: false });
};

request.onsuccess = function () {
  console.log("Database opened successfully");
  const db = request.result;
  const transaction = db.transaction("songs", "readwrite");
  const store = transaction.objectStore("songs");

  store.put({
    id: 1,
    name: "Cursetest",
    artist: "Curse Artist",
    time: "111",
    mp3data: "curemp3DataURL",
    image: "cureimageDataURL",
  });
  store.put({
    id: 2,
    name: "Bad Habitstests",
    artist: "Bad Habits artist",
    time: "222",
    mp3data: "badhabitsmp3DataURL",
    image: "badhabitsimageDataURL",
  });
  store.put({
    id: 3,
    name: "test song",
    artist: "test artist",
    time: "333",
    mp3data: "testDataURL",
    image: "testimageDataURL",
  });

  transaction.oncomplete = function () {
    db.close();
  };
};

SubmitFile.addEventListener("click", () => {
  console.log("open db on event click");
  let indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

  let open = indexedDB.open("SongsDatabase", 1);

  open.onupgradeneeded = function () {
    let db = open.result;
    const store = db.createObjectStore("songs", { keyPath: "id" });
    store.createIndex("song_name", ["name"], { unique: false });
  };

  open.onsuccess = function () {
    let db = open.result;
    let tx = db.transaction("songs", "readwrite");
    let store = tx.objectStore("songs");
    let countIndex = store.count();
    countIndex.onsuccess = function () {
      console.log(countIndex.result + 1);
      store.put({
        id: countIndex.result + 1,
        name: songName,
        artist: songArtist,
        time: audioTime,
        mp3data: songMp3,
        image: songDisplay,
      });

      const songIndex = store.index("song_name");
      const SQuery = songIndex.get([songName]);
      const audioSong = document.querySelector("audio");

      SQuery.onsuccess = function () {
        console.log("time :", SQuery.result.time);
        audioSong.src = `${SQuery.result.mp3data}`;
      };
    };
    tx.oncomplete = function () {
      db.close();
    };
  };
});

backButton.addEventListener("click", () => {
  console.log("open db on event click");
  let indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

  let open = indexedDB.open("SongsDatabase", 1);

  open.onupgradeneeded = function () {
    let db = open.result;
    const store = db.createObjectStore("songs", { keyPath: "id" });
    store.createIndex("song_name", ["name"], { unique: false });
  };

  open.onsuccess = function () {
    let db = open.result;
    let tx = db.transaction("songs", "readwrite");
    let store = tx.objectStore("songs");

    let countIndex = store.count();
    countIndex.onsuccess = function () {
      indexCount == 1 ? null : indexCount--;
      console.log("test");

      const IDQuery = store.get(indexCount);
      IDQuery.onsuccess = function () {
        console.log("IDQuery.result:", IDQuery.result);
        const isThereAnArtist = new Image();

        isThereAnArtist.src = IDQuery.result.artistIMG;
        isThereAnArtist.onload = function () {
          // The image has been successfully loaded
          img.src = IDQuery.result.artistIMG;
        };
        // Set a callback function to run if there was an error loading the image
        isThereAnArtist.onerror = function () {
          // There was an error loading the image
          img.src = IDQuery.result.image;
          // // call style again to display any user uploaded songs not from url
          //img.style.backgroundImage = IDQuery.result.image;
        };

        audioSong.src = `${IDQuery.result.mp3data}`;

        PreviewSongArt.src = IDQuery.result.image;
        PreviewTitle.innerHTML = IDQuery.result.name;
        PreviewArtistName.innerHTML = IDQuery.result.artist;

        MPimg.src = IDQuery.result.image;

        MPName.innerHTML = IDQuery.result.name;
        MPArtist.innerHTML = IDQuery.result.artist;
      };
    };

    tx.oncomplete = function () {
      db.close();
    };
  };
});

forwardButton.addEventListener("click", () => {
  console.log("open db on event click");
  let indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

  let open = indexedDB.open("SongsDatabase", 1);

  open.onupgradeneeded = function () {
    let db = open.result;
    const store = db.createObjectStore("songs", { keyPath: "id" });
    store.createIndex("song_name", ["name"], { unique: false });
  };

  open.onsuccess = function () {
    let db = open.result;
    let tx = db.transaction("songs", "readwrite");
    let store = tx.objectStore("songs");
    const audioSong = document.querySelector("audio");

    let countIndex = store.count();
    countIndex.onsuccess = function () {
      indexCount == countIndex.result ? null : indexCount++;
      console.log("test");

      const IDQuery = store.get(indexCount);
      IDQuery.onsuccess = function () {
        console.log("IDQuery.result:", IDQuery.result);
        const isThereAnArtist = new Image();

        isThereAnArtist.src = IDQuery.result.artistIMG;
        isThereAnArtist.onload = function () {
          // The image has been successfully loaded
          img.src = IDQuery.result.artistIMG;
        };
        // Set a callback function to run if there was an error loading the image
        isThereAnArtist.onerror = function () {
          // There was an error loading the image
          img.src = IDQuery.result.image;
          // // call style again to display any user uploaded songs not from url
          //img.style.backgroundImage = IDQuery.result.image;
        };

        audioSong.src = `${IDQuery.result.mp3data}`;

        PreviewSongArt.src = IDQuery.result.image;
        PreviewTitle.innerHTML = IDQuery.result.name;
        PreviewArtistName.innerHTML = IDQuery.result.artist;

        MPimg.src = IDQuery.result.image;

        MPName.innerHTML = IDQuery.result.name;
        MPArtist.innerHTML = IDQuery.result.artist;
      };
    };

    tx.oncomplete = function () {
      db.close();
    };
  };
});
