import { DataSnapshot, onValue, ref, update } from "firebase/database";
import { database } from "./firebase";

function getDataSnapshotOnce(path: string): Promise<DataSnapshot> {
  return new Promise((resolve, reject) =>
    onValue(ref(database, path), resolve, reject, { onlyOnce: true })
  );
}

const userId2uid: { [userId: string]: string } = {};

export async function migrate() {
  const root = "/v1";
  const snapshot = await getDataSnapshotOnce(root + "/users");
  snapshot.forEach((userChild) => {
    const userId = userChild.key ?? "unknown";
    const uid = userId2uid[userId];
    const songs = userChild.child("songs").val();
    const updates = {
      [`${root}/users/${uid}/songs`]: songs,
      [`${root}/users/${uid}/screenName`]: userId,
    };
    update(ref(database), updates);
  });
}
