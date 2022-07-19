const valueOf = (query) => document.querySelector(query).value
const checked = (query) => document.querySelector(query).checked

const subforumOptions = {
    suggestions: 'Suggestions',
    ats: 'Advanced Topics',
    qas: 'Questions about Scratch',
    hws: 'Help with scripts'
}

async function createApplication() {
    // Function to fill in a template with proper values
    let application = '';
    application += `[START of application] \n`
    application += `@${valueOf('#username')} - `

    let activeSubforums = [];

    for (let subforum in subforumOptions) {
        if (checked(`#${subforum}`)) {
            activeSubforums.push(subforumOptions[subforum])
        }
    }
    application += `active in ${activeSubforums.join(", ")}. \n`

    let posts = Array.from(document.querySelectorAll('.post-id'));
    posts.forEach((post, index) => {
        posts[index] = post.value;
    })

    application += `Most constructive posts - ${posts.join(", ")}. \n`
    application += `Most recent post: ${valueOf("#recent")}. \n`
    if (!valueOf("#additional").trim() !== "") {
        application += `Additional info: ${valueOf("#additional")}. \n`
    }
    application += `[END of application]`
    console.log(application)
    document.querySelector('.result').style.display = "block";
    document.querySelector('#result').innerText = application;

}

document.querySelector("#create").addEventListener("click", createApplication)