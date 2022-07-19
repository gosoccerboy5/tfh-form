const betterPostLink = (link) => link.replace(/topic\/\d+\/\?page=\d#post-/, 'post/')
// Thanks to @gosoccerboy5 for the above function

const valueOf = (query) => document.querySelector(query).value
const checked = (query) => document.querySelector(query).checked

const subforumOptions = {
    suggestions: 'Suggestions',
    ats: 'Advanced Topics',
    qas: 'Questions about Scratch',
    hws: 'Help with Scripts'
}

async function createApplication() {
    // Function to fill in a template with proper values
    let application = ''
    const username = valueOf('#username')
    application += `@${valueOf('#username')} - `

    let activeSubforums = []

    // Out of all the subforums, note down all the user has selected
    for (let subforum in subforumOptions) {
        if (checked(`#${subforum}`)) {
            activeSubforums.push(subforumOptions[subforum])
        }
    }
    application += `active in ${activeSubforums.join(', ')}. \n`

    let posts = Array.from(document.querySelectorAll('.post-id')).filter(post => post.value.trim() !== '')
    for (let index = 0; index < posts.length; index++) {
        const post = posts[index];
        posts[index] = betterPostLink(post.value)
        if (post.value.trim() !== '') {
            let data = await (await fetch('https://scratchdb.lefty.one/v3/forum/post/info/' + post.value.match(/\d+/))).json()
            if (data.username.toLowerCase() !== username.toLowerCase() || !activeSubforums.includes(data.topic.category)) {
                alert('Oh dear! It appears one of the posts you supplied as "constructive" '
                + 'was not in the forums you said you were most active in or not your own post.\n'
                + 'Make sure all the posts you link are yours and fall under constructive subforums.')
                return
            }
        }
    }
    if (posts.length <= 1) {
        alert('Oh dear! It appears you did not supply enough constructive posts. Please add more.')
        return
    }

    application += `Most constructive posts - ${posts.join(', ')}. \n`

    let recentPost = betterPostLink(valueOf('#recent'))
    try {
        let RPdata = await (await fetch('https://scratchdb.lefty.one/v3/forum/post/info/' + recentPost.match(/\d+/))).json();
        if (RPdata.username.toLowerCase() !== username.toLowerCase()) {
            alert('Oh dear! It appears the most recent post you supplied wasn\'t your own post.')
            return
        }
    } catch {
        alert('Oh dear! It appears the most recent post you supplied wasn\'t valid or didn\'t exist.')
        return
    }
    application += `Most recent post: ${recentPost}. \n`
    if (!valueOf('#additional').trim() !== '') {
        application += `Additional info: ${valueOf('#additional')}. \n`
    }

    document.querySelector('.result').style.display = 'block'
    document.querySelector('#result').innerText = application
}

document.querySelector('#create').addEventListener('click', createApplication)
