import '../styles.css';

console.log('YouTube video page detected!');

function onNewVideoPlay() {
  console.log('A new video is playing:', document.title);
  chrome.runtime.sendMessage('createBoxElement');
}

const titleObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      onNewVideoPlay();
    }
  });
});

titleObserver.observe(document.querySelector('title'), { childList: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'createBoxElement') {
    let helloBox = document.querySelector('.main-box');

    if (helloBox) {
      helloBox.remove();
    }

    helloBox = document.createElement('div');
    helloBox.className = 'main-box';
    helloBox.textContent = 'Hello';

    const summarizeButton = document.createElement('button');
    summarizeButton.textContent = 'Summarize';
    summarizeButton.className = 'summarize-button';

    summarizeButton.onclick = () => {
      const videoUrl = window.location.href;

      const spinner = document.createElement('div');
      spinner.textContent = 'Loading...';
      spinner.className = 'spinner';
      helloBox.appendChild(spinner);

      fetch('https://nodejs-serverless-function-express-chi-rust.vercel.app/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      })
      .then(response => response.json())
      .then(data => {
        spinner.remove();

        const dataContent = document.createElement('pre');

        if (typeof data === 'string') {
          dataContent.textContent = data;
        } else {
          dataContent.textContent = JSON.stringify(data, null, 2);
        }

        helloBox.appendChild(dataContent);
      })
      .catch(error => {
        spinner.remove();
        console.error('Error fetching data:', error);
      });
    };

    helloBox.appendChild(summarizeButton);

    const recommendedSection = document.querySelector('#secondary #related');
    if (recommendedSection) {
      recommendedSection.parentElement.insertBefore(helloBox, recommendedSection.parentElement.firstChild);

    } else {
      console.log('Recommended section not found');
    }
  }
});
