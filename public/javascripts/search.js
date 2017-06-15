const searchApi = {

    search: (input) => {

        return new Promise((resolve, reject) => {
            $.ajax(`https://www.reddit.com/search.json?q=${input}&sort=new?callback=?`, {
                method: 'GET',
                success: (res, status, xhr) => resolve(res),
                error: (xhr, status, error) => reject(xhr.responseJSON),
            });
        });
    },
}

$('#redditSearchForm').on('submit', e => {
    e.preventDefault();

    const input = $('input[name=reddit-search-input]').val();
    resetInput();

    if (!input) {
        return;
    }

    searchApi.search(input)
        .then((response, error) => {
            error ? onRedditSearchFailed(error, input) : onRedditSearchSuccess(response, input);
        });

});

function onRedditSearchSuccess(result, input) {
    const { data: { children } } = result;

    const data = children.map(child => {
        const { data: { author, url, title, selftext, thumbnail, preview } } = child;
        return {
            author,
            url,
            title,
            selftext,
            thumbnail: preview ? preview.images[0].source.url : thumbnail,
        };
    })

    data.length ? displayResult(data, input) : displayDefaultResult(input);
}

function onRedditSearchFailed(err, input) {
    displayDefaultResult(input);
}

function displayResult(result, input) {

    $('.reddit-result-row, thead').remove();
    $('.reddit-noresult-panel').hide();
    $('.reddit-result-panel').show();
    createTableHeader(input);
    result.forEach(res => {
        const { author, url, title, selftext, thumbnail } = res;
        $('#redditresult').append(`
            <div class="reddit-result-row">
                <div>
                    <span>${author}</span></div>
                <div><a 
                    href="${url}"
                    title="${url}"
                    target="_blank"
                    rel='noopener noreferrer'
                    >Link</a>
                </div>
                <div>${title}</div>
                <div>${selftext}</div>
                <div><img src="${thumbnail}"/></div>
            </div>
        `);
    });
}

function createTableHeader(input) {

    $('#reddit-results .panel-heading').html(`Reddit result for: <b>${input}</b>`);
    $('#redditresult').append(`
        <div class="reddit-result-row">
            <div>Author</div>
            <div>Url</div>
            <div>Title</div>
            <div>Selftext</div>
            <div>Image</div>
        </div>`);
}

function displayDefaultResult(input) {
    $('.reddit-result-row, thead').remove();
    $('.reddit-result-panel').hide();
    $('.reddit-noresult-panel').show();
    $('.reddit-noresult-panel .panel-heading').html(`<span>No result for <b>${input}</b></span>`);
}

function resetInput() {
    setTimeout(() => {
        $('input').val('');
    }, 100);
}