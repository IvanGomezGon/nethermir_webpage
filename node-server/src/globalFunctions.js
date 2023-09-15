const feedbackFetch = (text, res) => {
    text = text == null ? '{}' : text
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.write(text);
    res.end();
};

const sleep = (ms)  => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

module.exports = {
    feedbackFetch,
    sleep,
};