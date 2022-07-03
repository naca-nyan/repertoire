import { DataSnapshot, onValue, ref } from "firebase/database";
import { database } from "./firebase";
import { isSong, pushSong } from "./data/song";

function getDataSnapshotOnce(path: string): Promise<DataSnapshot> {
  return new Promise((resolve, reject) =>
    onValue(ref(database, path), resolve, reject, { onlyOnce: true })
  );
}

export async function migrate(from: string) {
  const snapshot = await getDataSnapshotOnce(from + "/users");
  snapshot.forEach((userChild) => {
    const userId = userChild.key ?? "unknown";
    userChild.child("songs").forEach((songChild) => {
      // eslint-disable-next-line
      const songId = songChild.key ?? "unknown song";
      const val = songChild.val();
      if (!isSong(val)) return;
      const song = val;
      pushSong(userId, song);
    });
  });
}
