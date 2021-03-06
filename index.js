const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const axios = require('axios');

const quotes = [
    'That\'ll be our little secret.',
    'In painting, you have unlimited power. You have the ability to move mountains. You can bend rivers. But when I get home, the only thing I have power over, is the garbage.',
    'Remember our Golden Rule: A thin paint sticks to a thick paint.',
    'And that makes it look like birch trees, isn\'t that sneaky? Heh. Ha. It\'s gorgeous.',
    'You know me, I gotta put in a big tree.',
    'Here\'s your bravery test!',
    'Gotta give him a friend. Like I always say \'everyone needs a friend\'.',
    'We don\'t know where it goes. We don\'t really care.',
    'Any time ya learn, ya gain.',
    'Any way you want it to be, that\'s just right.',
    'As my son Steve says, just \'smoosh\' it in there. It\'s not a real word, but people seem to know what it means.',
    'Be sure to use odorless paint-thinner. If it\'s not odorless, you\'ll find yourself working alone very, very quick.',
    'Let\'s just blend this little rascal here, ha! Happy as we can be.',
    'Clouds are very, very free.',
    'Just put a few do-ers in there...',
    'Decide where your little footy hills live.',
    'Haha, and just beat the devil out of it.',
    'I like to beat the brush.',
    'You can use a brush rack to hit the brush on. Otherwise you will become unpopular real fast.',
    'If you did this with yellow, and you went over it with blue, you would end up with a .. with a translucent... green. And it\'s gorgeous. It is GORGEOUS.',
    'If you did this with blue, and you went over it with yellow, you would end up with a nice green sky. And that\'s not the thing we are looking for.',
    'Just lightly blend it, one hair and some air.',
    'Tender as a mothers love... And with my mother, that was certainly true.',
    'Let\'s do a little cabinectomy here.',
    'Oh, you\'d be in Agony City by now.',
    'Just scrape in a few indications of sticks and twigs and other little things in there. People will think you spend hours doing this.',
    'Little raccoons and old possums \'n\' stuff all live up in here. They\'ve got to have a little place to sit.',
    'Little squirrels \'n\' rabbits, and if this was in Florida or Georgia somewhere down there, might be an alligator or two hid back here.',
    'Maybe in our world there lives a happy little tree over there.',
    'Oh, green water... oh that\'s pretty. Boy, I like that, just alive with algae.',
    'Oh, that would make a nice place to fish. I like fishing, but I\'m not a very good fisherman. I always throw the fish back into the water, just put a band-aid on his mouth, tap \'im on the patootie and let him on his way. And maybe some day, if I\'m lucky, I\'ll get to catch him again.',
    'Oooh, if you have never been to Alaska, go there while it is still wild. My favorite uncle asked me if I wanted to go there, Uncle Sam. He said if you don\'t go, you\'re going to jail. That is how Uncle Sam asks you.',
    'People look at me like I\'m a little strange, when I go around talking to squirrels and rabbits and stuff. That\'s ok. Thaaaat\'s just ok.',
    'People might look at you a bit funny, but it\'s okay. Artists are allowed to be a bit different.',
    'Shwooop. Hehe. You have to make those little noises, or it just doesn\'t work.',
    'Talk to the tree, make friends with it.',
    'I taught my son to paint mountains like these, and guess what? Now he paints the best darn mountains in the industry.',
    'That\'s a crooked tree. We\'ll send him to Washington.',
    'That\'s where the crows will sit. But we\'ll have to put an elevator to put them up there because they can\'t fly, but they don\'t know that, so they still try.',
    'The only thing worse than yellow snow is green snow.',
    'The secret to doing anything is believing that you can do it. Anything that you believe you can do strong enough, you can do. Anything. As long as you believe.',
    'The trees are oh so soft, oh so soft I freakin\' love it.',
    'There\'s nothing wrong with having a tree as a friend.',
    'Trees cover up a multitude of sins.',
    'Try to imagine that you are a tree. How do you want to look out here?',
    'Water\'s like me. It\'s laaazy... Boy, it always looks for the easiest way to do things.',
    'We don\'t make mistakes, we just have happy accidents.',
    'We tell people sometimes: we\'re like drug dealers, come into town and get everybody absolutely addicted to painting. It doesn\'t take much to get you addicted.',
    'We want happy paintings. Happy paintings. If you want sad things, watch the news.',
    'We\'re gonna make some big decisions in our little world.',
    'Well, the little clock on the wall says we\'re just about out of time. God bless you my friend.',
    'From all of us here I\'d like to wish you happy painting...and God bless my friend.',
    'When I was teaching my son Steve to paint, I used to tell him, just pretend he was a whisper, and he floated right across the mountain, that easy, gentle, make love to it, caress it.',
    'You can do anything you want to do. This is your world.',
    'I can\'t go over 30 minutes, because we have a mean ol\' director with no sense of humor.',
    'You can put as many or as few as you want in your world.',
    'Even if you\'ve never painted before, this one you can do.',
    'This is the hardest part of this method. If you can do this, you can do anything.',
    'Roll it in a little bright red and lets sign this right in here. Luckily I have a short name so it\'s easy to sign.',
    'And just go straight in like your going to stab it. And barely touch it...barely touch it.',
    'When we teach people to paint this is the one they fall in love with. It works ',
    'We don\'t make mistakes, just happy little accidents.',
    'Talent is a pursued interest. Anything that you\'re willing to practice, you can do.',
    'There\'s nothing wrong with having a tree as a friend.',
    'Let\'s get crazy.',
    'I guess I\'m a little weird. I like to talk to trees and animals. That\'s okay though; I have more fun than most people.',
    'I can\'t think of anything more rewarding than being able to express yourself to others through painting. Exercising the imagination, experimenting with talents, being creative; these things, to me, are truly the windows to your soul.',
    'All you need to paint is a few tools, a little instruction, and a vision in your mind.',
    'There are no mistakes, only happy accidents.',
    'wash the brush, just beats the devil out of it ',
    'I started painting as a hobby when I was little. I didn\'t know I had any talent. I believe talent is just a pursued interest. Anybody can do what I do.',
    'The secret to doing anything is believing that you can do it. Anything that you believe you can do strong enough, you can do. Anything. As long as you believe.',
    'Mix up a little more shadow color here, then we can put us a little shadow right in there. See how you can move things around? You have unlimited power on this canvas -- can literally, literally move mountains',
    'There are no mistakes, just happy accidents.',
    'There\'s nothing in the world that breeds success like success.',
    'Let\'s get a little crazy here',
    'Believe that you can do it cause you can do it.',
    'We don\'t make mistakes, we just have happy accidents.',
    'In life you need colors.',
    'It\'s a super day, so why not make a beautiful sky?',
    'Just let go - and fall like a little waterfall',
    'It\'s beautiful - and we haven\'t even done anything to it yet',
    'Be careful. You can always add more - but you can\'t take it away.',
    'Pretend you\'re water. Just floating without any effort. Having a good day.',
    'They say everything looks better with odd numbers of things. But sometimes I put even numbers - just to upset the critics.',
    'When things happen - enjoy them. They\'re little gifts.',
    'Take your time. Speed will come later.',
    'It\'s amazing what you can do with a little love in your heart.',
    'God gave you this gift of imagination. Use it.',
    'Paint anything you want on the canvas. Create your own world.',
    'That\'s what painting is all about. It should make you feel good when you paint.',
    'You can do anything your heart can imagine.',
    'With practice comes confidence.',
    'This is happy place, little squirrels live here and play.',
    'We have no limits to our world. We\'re only limited by our imagination.',
    'Be so very light. Be a gentle whisper.',
    'The least little bit can do so much.',
    'All you have to do is let your imagination go wild.',
    'Didn\'t you know you had that much power? You can move mountains. You can do anything.',
    'If you don\'t like it - change it. It\'s your world.',
    'There is immense joy in just watching - watching all the little creatures in nature.',
    'Don\'t forget to tell these special people in your life just how special they are to you.',
    'That is when you can experience true joy, when you have no fear.',
    'We don\'t really know where this goes - and I\'m not sure we really care.',
    'Life is too short to be alone, too precious. Share it with a friend.',
    'Work on one thing at a time. Don\'t get carried away - we have plenty of time.',
    'If we\'re going to have animals around we all have to be concerned about them and take care of them.',
    'Dead trees are also a part of nature.',
    'Almost everything is going to happen for you automatically - you don\'t have to spend any time working or worrying.',
    'Sometimes you learn more from your mistakes than you do from your masterpieces.',
    'You can do anything your heart can imagine.',
    'There are no limits in this world.',
    'You can create anything that makes you happy.',
    'You want your tree to have some character. Make it special.',
    'In your world you have total and absolute power.',
    'The man who does the best job is the one who is happy at his job.',
    'Everything\'s not great in life, but we can still find beauty in it.',
    'Don\'t hurry. Take your time and enjoy.',
    'You\'re the greatest thing that has ever been or ever will be. You\'re special. You\'re so very special.',
    'There are no accidents. There are no mistakes.',
    'There is no right or wrong - as long as it makes you happy and doesn\'t hurt anyone.',
    'Everyone needs a friend. Friends are the most valuable things in the world.',
    'There are no mistakes. You can fix anything that happens.',
    'That\'s why I paint - because I can create the kind of world I want - and I can make this world as happy as I want it.',
    'It\'s life. It\'s interesting. It\'s fun.',
    'You are free in your world. You can do anything you want in it.',
    'How do you make a round circle with a square knife? That\'s your challenge for the day.',
    'Just think about these things in your mind - then bring them into your world.',
    'We each see the world in our own way. That\'s what makes it such a special place.',
    'In your imagination you can go anywhere you want.',
    'That\'s what makes life fun. That you can make these decisions. That you can create the world that you want.',
    'Go out on a limb - that\'s where the fruit is.',
    'In this world, everything can be happy.',
    'There\'s just no limit to the things you can do.',
    'Anything you sincerely believe in your heart - you can do.',
    'All you have to learn here is how to have fun.',
    'Isn\'t it great to do something you can\'t fail at?',
    'There is absolutely no limit to what you can do. You\'re limited only by your imagination.',
    'Anytime you learn something your time and energy are not wasted.',
    'Let your imagination take you where you want to be.',
    'A tree cannot be straight if it has a crooked trunk.',
    'You\'ve got to learn to fight the temptation to resist these things. Just let them happen.',
    'You create the dream - then you bring it into your world.',
    'These things happen automatically. All you have to do is just let them happen.',
    'You can do anything here. So don\'t worry about it.',
    'This present moment is perfect simply due to the fact you\'re experiencing it.',
    'Only God can make a tree - but you can paint one.',
    'You can\'t make a mistake. Anything that happens you can learn to use - and make something beautiful out of it.',
    'That\'s when you experience joy - when you have no fear.',
    'Put light against light - you have nothing. Put dark against dark - you have nothing. It\'s the contrast of light and dark that each give the other one meaning.',
    'This is an example of what you can do with just a few things, a little imagination and a happy dream in your heart.',
    'You can have anything you want in the world - once you help everyone around you get what they want.',
    'If what you\'re doing doesn\'t make you happy - you\'re doing the wrong thing.',
    'This is your world. Design it exactly how you want it.',
    'Remember - every highlight needs its shadow.',
    'We don\'t make mistakes. We have happy accidents.',
    'Every single thing in the world has its own personality - and it is up to you to make friends with the little rascals.',
    'Just relax and let it flow. That easy.',
    'Trees grow however makes them happy.',
    'Don\'t kill all your dark areas - you need them to show the light.',
    'Everyone wants to enjoy the good parts - but you have to build the framework first.',
    'A big strong tree needs big strong roots.',
    'Realize - you cannot make a mistake here.',
    'The light is your friend. Preserve it.',
    'Everybody\'s different. Trees are different. Let them all be individuals.',
    'We want to use a lot pressure while using no pressure at all.',
    'Follow the lay of the land. It\'s most important.',
    'We don\'t have anything but happy trees here.',
    'When you have this much power you have to make decisions.',
    'Even trees need a friend. We all need friends.',
    'Isn\'t it fantastic that you can change your mind and create all these happy things?',
    'The first step to doing anything is to believe you can do it. See it finished in your mind before you ever start.',
    'No worries. No cares. Just float and wait for the wind to blow you around.',
    'It just happens - whether or not you worried about it or tried to plan it.',
    'If it\'s not what you want - stop and change it. Don\'t just keep going and expect it will get better.',
    'You can create the world you want to see and be a part of. You have that power.',
    'How to paint. That\'s easy. What to paint. That\'s much harder.',
    'All you have to do is create a vision in your mind and bring it into reality.',
    'This was my freedom. I\'d go home and paint. And there I could create any kind of world I wanted. It was clean. The water wasn\'t polluted. Everyone was happy.',
    'We can always carry this a step further. There\'s really no end to this.',
    'And automatically it just occurs. You don\'t have to worry about it. It just happens. And that\'s really what makes it fun.',
    'But we\'re not there yet, so we don\'t need to worry about it.',
    'When you are creator you have to make these big decisions.',
    'This is your creation - and it\'s just as unique and special as you are.',
    'La- da- da- da- dah. Just be happy.',
    'Just take out whatever you don\'t want. It\'ll change your entire perspective.',
    'If you don\'t think every day is a good day - try missing a few. You\'ll see.',
    'Look at it. Practice it. A little bit of practice here will pay you tremendous dividends.',
    'However you think it should be. That\'s exactly how it should be.',
    'There isn\'t a rule. You just practice and find out which way works best for you.',
    'Remember, this is your world and you can do anything you want here.',
    'Just let your mind wander and enjoy. This should make you happy.',
    'We don\'t have to be committed. We are just playing here.',
    'Remember how free clouds are. They just lay around in the sky all day long.',
    'If you learn anything - it wasn\'t wasted time.',
    'Trees and people. We\'re all the same. We all have a very special personality.',
    'But on this canvas I can say anything. I can build anything. I can create a world that makes me happy. It\'s bright and it\'s shiny. There\'s nothing bad here.',
    'Any little thing can be your friend if you let it be.',
    'The very fact that you\'re aware of suffering is enough reason to be overjoyed that you\'re alive and can experience it',
    'And that\'s when it becomes fun - you don\'t have to spend your time thinking about what\'s happening - you just let it happen.',
    'This is probably the greatest thing to happen in my life - to be able to share this with you.',
    'If there are two big trees, eventually there will be a little tree.',
    'Everybody needs a friend.',
    'You can do anything here - the only pre-requisite is that it makes you happy.',
    'Just allow it to happen and automatically all these beautiful things will happen.',
    'Follow the lay of the land… it\'s most, most important.',
    'The more we do this - the more it will do good things to our heart.',
    'Even the worst thing we can do here is good.',
    'Absolutely no pressure. You are just a whisper floating across a mountain.',
    'You have freedom here. The only guide is your heart.',
    'Trees grow in all kinds of ways. They\'re not all perfectly straight. Not every limb is perfect.',
    'We must be quiet, soft and gentle.',
    'You can\'t have light without dark. You can\'t know happiness unless you\'ve known sorrow.',
    'Just let this happen. We just let this flow right out of our minds.',
    'I remember when my Dad told me as a kid, ‘If you want to catch a rabbit, stand behind a tree and make a noise like a carrot. Then when the rabbit comes by you grab him.\' Works pretty good until you try to figure out what kind of noise a carrot makes…',
    'Just make a decision and let it go.',
    'Everything is happy if you choose to make it that way.',
    'You could sit here for weeks with your one hair brush trying to do that - or you could do it with one stroke with an almighty brush.',
    'We\'re not trying to teach you a thing to copy. We\'re just here to teach you a technique, then let you loose into the world.',
    'We don\'t know where it\'s going - and we don\'t need to care. Just let it go.',
    'And when you practice this you will see that you are able to use anything that happens.',
    'See these things in your mind - then make them real.',
    'A tree needs to be your friend if you\'re going to paint him.',
    'You have to make almighty decisions when you\'re the creator.',
    'This your world, whatever makes you happy you can put in it. Go crazy.',
    'We don\'t have to be concerned about it. We just have to let it fall where it will.',
    'It is your world - but even in your world you just have to let it happen.',
    'We don\'t need any guidelines or formats. All we need to do is just let it flow right out of us.',
    'Let all these little things happen. Don\'t fight them. Learn to use them.',
    'I sincerely wish for you every possible joy life could bring.',
    'We spend so much of our life looking - but never seeing.',
    'Talent is a pursued interest. That is to say, anything you practice you can do.'
]

function getRandomElementFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
    try {
        /*
        const payload = JSON.stringify(github, undefined, 2)
        console.log(`The event payload: ${payload}`);
        */

        const githubToken = core.getInput('github-token');

        //TODO: create a txt file with a random quote or take a random image 
        //      from paintings file, and have it commit that file to the 
        //      repository (or update the readme?).

        const accident = Math.floor(Math.random() * 2) === 0 ? 'quote' : 'painting';
        console.log(accident);

        let content = null;

        fs.readdirSync('./').forEach(file => {
            console.log(file);
        });

        fs.readdirSync(__dirname).forEach(f => {
            console.log(f);
        });

        let fileName = null;

        switch (accident) {
            case 'quote':
                const quote = getRandomElementFromArray(quotes);
                fileName = `happy-little-quote-${Date.now()}.txt`;
                const filePath = `${__dirname}/${fileName}`

                console.log(quote);
                console.log(filePath);

                fs.writeFileSync(filePath, quote, { flag: 'wx' }, function(err) {
                    if (err) {
                        console.log(error.message);
                    } else {
                        console.log('Saved!');
                    }
                });

                content = fs.readFileSync(filePath).toString('base64');

                break;

            case 'painting':
                let paintingsUrls = []
                for (var i = 4; i <= 411; i++) {
                    paintingsUrls.push(`https://raw.githubusercontent.com/rdlucas2/happy-little-action/master/paintings/painting${i}.png`);
                }
                const painting = getRandomElementFromArray(paintingsUrls);
                console.log(painting);

                const response = await axios.get(painting, { responseType: 'arraybuffer' });
                console.log(response);
                //.then(response => Buffer.from(response.data, 'binary').toString('base64'))

                fileName = `happy-little-painting-${Date.now()}.png`;
                content = Buffer.from(response.data, 'binary').toString('base64');

                break;
        }

        if (content) {
            const octokit = github.getOctokit(githubToken);
            const owner = `${github.context.payload.repository.owner.login}`;
            const repo = github.context.payload.repository.name;
            const path = `${fileName}`;

            console.log(owner);
            console.log(repo);
            console.log(path);

            const res = await octokit.repos.createOrUpdateFileContents({
                owner: owner,
                repo: repo,
                path: path,
                message: 'A happy little accident.',
                content: content,
                /*
                committer: {
                  name: `Octokit Bot`,
                  email: null,
                },
                author: {
                  name: "Octokit Bot",
                  email: null",
                },
                */
            });

            console.log(res);
        }

    } catch (error) {
        core.setFailed(error.message);
    }
}

run();