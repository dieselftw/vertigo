const dogSrc = 'https://media.tenor.com/fej4_qoxdHYAAAAM/cute-puppy.gif';

const generateDogGif = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id || 0, 'createBoxElement');
};

const App = () => {
  return (
    <main>
      <h1>Add a Dog Gif to Webpage</h1>
      <img src={dogSrc} alt="Cute Puppy" />
      <button onClick={generateDogGif}>Generate Dog Gif</button>
    </main>
  );
};

export default App;