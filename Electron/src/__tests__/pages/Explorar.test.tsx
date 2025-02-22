import '@testing-library/jest-dom';
import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Explorar from 'pages/Explorar/Explorar';
import { BrowserRouter } from 'react-router-dom';
import Global from 'global/global';

const playlistName = 'playlisttest';
const songName = 'songName';
const userName = 'pruebaplaylistuser';
const artistName = 'pruebaplaylistartist';

const artistMockFetch = {
  name: artistName,
  photo: 'photo',
  register_date: 'date',
  password: 'hashpassword',
  playback_history: [songName],
  playlists: [playlistName],
  saved_playlists: [playlistName],
  uploaded_songs: [songName],
};

const userMockFetch = {
  name: userName,
  photo: 'photo',
  register_date: 'date',
  password: 'hashpassword',
  playback_history: [songName],
  playlists: [playlistName],
  saved_playlists: [playlistName],
};

const playlistDTOMockFetch = {
  name: playlistName,
  photo: 'playlist',
  description: 'des',
  upload_date: 'date',
  owner: 'username fake',
  song_names: [],
};

const songMockFetch = {
  name: songName,
  artist: 'username fake song',
  photo: 'photo',
  duration: '180',
  genre: 'Rock',
  number_of_plays: 2,
};

global.fetch = jest.fn((url: string) => {
  if (url === `${Global.backendBaseUrl}generos/`) {
    return Promise.resolve({
      json: () => Promise.resolve({ ROCK: 'Rock', POP: 'Pop' }),
      status: 200,
    });
  }
  if (url === `${Global.backendBaseUrl}search/?nombre=${'prueba'}`) {
    return Promise.resolve({
      json: () =>
        Promise.resolve({
          playlists: [JSON.stringify(playlistDTOMockFetch)],
          songs: [JSON.stringify(songMockFetch)],
          users: [JSON.stringify(userMockFetch)],
          artistas: [JSON.stringify(artistMockFetch)],
        }),
      status: 200,
    }).catch((error) => {
      console.log(error);
    });
  }
  // In case the URL doesn't match, return a rejected promise
  return Promise.reject(new Error('Unhandled URL in fetch mock'));
}) as jest.Mock;

test('Render Explorar and get Genres', async () => {
  const component = await act(() => {
    return render(
      <BrowserRouter>
        <Explorar changeSongName={jest.fn()} refreshSidebar={jest.fn()} />
      </BrowserRouter>,
    );
  });
  expect(component).toBeTruthy();
});

test('Explorar filter by name', async () => {
  const component = await act(() => {
    return render(
      <BrowserRouter>
        <Explorar changeSongName={jest.fn()} refreshSidebar={jest.fn()} />
      </BrowserRouter>,
    );
  });

  const inputSearchBar = component.getByTestId('explorar-input-searchbar');
  await act(async () => {
    fireEvent.change(inputSearchBar, { target: { value: 'prueba' } });
  });

  expect(component.getByText(playlistName)).toBeInTheDocument();
  expect(component.getByText(songName)).toBeInTheDocument();
  expect(component.getByText(userName)).toBeInTheDocument();
  expect(component.getByText(artistName)).toBeInTheDocument();
});
