

const exp = (function() {


    let p = {};

    let settings = {
        gameType: ['streak', 'bern'][Math.floor(Math.random() * 2)],
        difficulty: [['easy', 'hard'], ['hard', 'easy']][Math.floor(Math.random() * 2)],
        nTrials: 50,
        colors: [['purple', 'orange'], ['orange', 'purple']][Math.floor(Math.random() * 2)],
    };

    jsPsych.data.addProperties({
        gameType: settings.gameType,
        difficulty_1: settings.difficulty[0],
        difficulty_2: settings.difficulty[1],
    });

   /*
    *
    *   INSTRUCTIONS
    *
    */


    function MakeAttnChk(settings, round) {

        let firstOrSecond = (round == 1) ? "first" : "second";
        let moreOrLess = (settings.difficulty[1] == "hard") ? "more" : "less";

        let correctAnswers_1 = [`10 tokens`, `0 tokens`, `20%`, `20%`, `If I respond after the tile disappears, my response will be incorrect.`];
        if (settings.gameType == "streak") { correctAnswers_1[0] = `30 tokens` };
        let correctAnswers_2 = (settings.difficulty[1] == "hard") ? [`The second version of Red vs. Blue is more difficult than the first version.`] : [`The second version of Red vs. Blue is less difficult than the first version.`];

        let attnChk;

        if (round == 1 && settings.gameType == "bern") {
            attnChk = {
                type: jsPsychSurveyMultiChoice,
                preamble: `<div class='parent' style='text-align: left; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions.</strong></p>
                    </div>`,
                questions: [
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>If you respond correctly to a tile, you will earn...</div>", 
                        name: `attnChk1`, 
                        options: [`0 tokens`, `10 tokens`, `20 tokens`, `30 tokens`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>If you respond incorrectly to a tile, you will earn...</div>", 
                        name: `attnChk2`, 
                        options: [`0 tokens`, `10 tokens`, `20 tokens`, `30 tokens`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>After each response, what are your chances of winning 5 extra tokens?</div>", 
                        name: `attnChk3`, 
                        options: [`0%`, `10%`, `20%`, `30%`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>After each response, what are your chances of losing 5 tokens?</div>", 
                        name: `attnChk4`, 
                        options: [`0%`, `10%`, `20%`, `30%`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>Which statement is true?</div>`, 
                        name: `attnChk5`, 
                        options: [`I can take as long as I want to respond to each tile.`, `If I respond after the tile disappears, my response will be incorrect.`],
                    },
                ],
                scale_width: 500,
                on_finish: (data) => {
                    const totalErrors = dmPsych.getTotalErrors(data, correctAnswers_1);
                    data.totalErrors = totalErrors;
                },
            };
        } else if (round == 1 && settings.gameType == "streak") {
            attnChk = {
                type: jsPsychSurveyMultiChoice,
                preamble: `<div class='parent' style='text-align: left; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions.</strong></p>
                    </div>`,
                questions: [
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>If you respond incorrectly after achieving a streak of three, you will earn...</div>", 
                        name: `attnChk1`, 
                        options: [`0 tokens`, `10 tokens`, `20 tokens`, `30 tokens`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>If you respond incorrectly after failing to start a streak, you will earn...</div>", 
                        name: `attnChk2`, 
                        options: [`0 tokens`, `10 tokens`, `20 tokens`, `30 tokens`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>After each streak, what are your chances of winning 5 extra tokens?</div>", 
                        name: `attnChk3`, 
                        options: [`0%`, `10%`, `20%`, `30%`],
                    },
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>After each streak, what are your chances of losing 5 tokens?</div>", 
                        name: `attnChk4`, 
                        options: [`0%`, `10%`, `20%`, `30%`],
                    },
                    {
                        prompt: `<div style='color: rgb(109, 112, 114)'>Which statement is true?</div>`, 
                        name: `attnChk5`, 
                        options: [`I can take as long as I want to respond to each tile.`, `If I respond after the tile disappears, my response will be incorrect.`],
                    },
                ],
                scale_width: 500,
                on_finish: (data) => {
                    const totalErrors = dmPsych.getTotalErrors(data, correctAnswers_1);
                    data.totalErrors = totalErrors;
                },
            };
        } else if (round == 2) {
            attnChk = {
                type: jsPsychSurveyMultiChoice,
                preamble: `<div class='parent' style='text-align: left; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions.</strong></p>
                    </div>`,
                questions: [
                    {
                        prompt: "<div style='color: rgb(109, 112, 114)'>Which of the following statements is true?</div>", 
                        name: `attnChk4`, 
                        options: [`The second version of Red vs. Blue is more difficult than the first version.`, `The second version of Red vs. Blue is less difficult than the first version.`],
                    },
                ],
                scale_width: 500,
                on_finish: (data) => {
                    const totalErrors = dmPsych.getTotalErrors(data, correctAnswers_2);
                    data.totalErrors = totalErrors;
                },
            };
        }

        const errorMessage = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>You provided the wrong answer.</p><p>Please continue to try again.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const conditionalNode = {
          timeline: [errorMessage],
          conditional_function: () => {
            const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };


        const howToEarn1_bern = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>Practice is now complete.</p>
                        <p>Next, you'll play two different versions of Red vs. Blue. During both versions, you'll be competing for a chance to win a <b>$100.00 bonus prize</b>.</p>
                        <p>Specifically, during both versions of Red vs. Blue, you'll earn tokens. The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00. To maximize your chances of winning a $100.00 bonus, you'll need to earn as many tokens as possible.</p>
                        <p>Continue to learn how to earn tokens!</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<div class='parent'>
                        <p>In Red vs. Blue, players earn 10 tokens for every correct response.</p>
                        <p>Players earn 0 tokens for every incorrect response.</p>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>For example, if you respond correctly, you'll see this message indicating that you earned 10 tokens.</p> 
                        <div class="play-area-inst">               
                            <div class="win-text-inst" style="color:green">+10 Tokens</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you respond incorrectly, you'll see this message indicating that you earned 0 tokens.</p> 
                        <div class="play-area-inst">               
                            <div class="loss-text-inst">+0 Tokens</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>In addition to earning tokens through your performance, you can gain or lose tokens randomly.
                        Specifically, at the end of each round, you have a 20% chance of winning 5 extra tokens, and a 20% chance of losing 5 tokens.</p>`,

                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you see "+5 Bonus," this means you randomly won 5 extra tokens. For example, this is what you'd see if you randomly won 5 extra tokens after responding correctly:</p>
                        <div class="play-area-inst">
                            <div class="win-text-inst" style="color:green">+10 Tokens</div>
                            <div class="plus-text-inst">+5 Bonus</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>This is what you'd see if you randomly won 5 extra tokens after responding incorrectly.</p>
                        <div class="play-area-inst">
                            <div class="loss-text-inst">+0 Tokens</div>
                            <div class="plus-text-inst">+5 Bonus</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you see "-5 Loss," this means you randomly lost 5 tokens. For example, this is what you'd see if you randomly lost 5 tokens after responding correctly:</p>
                        <div class="play-area-inst">
                            <div class="win-text-inst" style="color:green">+10 Tokens</div>
                            <div class="minus-text-inst">-5 Loss</div>,
                        </div>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>This is what you'd see if you randomly lost 5 tokens after responding incorrectly:</p>
                        <div class="play-area-inst">
                            <div class="loss-text-inst">+0 Tokens</div>
                            <div class="minus-text-inst">-5 Loss</div>,
                        </div>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p><b>WARNING: During Red vs. Blue, you must respond to each tile as fast as possible!</b></p>
                        <p>Each tile will disappear very quickly. If you fail to respond correctly before a tile disappears, your response will be considered incorrect.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const howToEarn1_strk = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>Practice is now complete.</p>
                        <p>Next, you'll play two different versions of Red vs. Blue. During both versions, you'll be competing for a chance to win a <b>$100.00 bonus prize</b>.</p>
                        <p>Specifically, during both versions of Red vs. Blue, you'll earn tokens. The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00. To maximize your chances of winning a $100.00 bonus, you'll need to earn as many tokens as possible.</p>
                        <p>Continue to learn how to earn tokens!</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>In Red vs. Blue, players earn tokens for streaks of consecutive successes.</p>
                        <p>Specifically, players earn 10 tokens for every consecutive correct response.</p>
                        <p>For example, a streak of 2 consecutive successes is worth 20 cents, 
                        a streak of 3 consecutive successes is worth 30 cents, and so on.</p>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>Each time you respond correctly, you'll see the length of your current streak.</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>For example, if you respond correctly three times in a row, you'll see this message:</p> 
                        <div class="play-area-inst">               
                            <div class="header" style="font-size: 30px; top: 10%">Current Streak: 3</div>                        
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>Each time you respond incorrectly, you'll see how many tokens you earned from your streak.</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>For example, if you respond incorrectly after achieving a streak of three, you'll see this message indicating that you earned 30 tokens.</p> 
                        <div class="play-area-inst">
                            <div class="win-text-inst" style="color:green">+30 Tokens</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you respond incorrectly after failing to start a streak, you'll see this message indicating that you earned 0 tokens.</p> 
                        <div class="play-area-inst">
                            <div class="loss-text-inst">+0 Tokens</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>In addition to earning tokens through your performance, you'll sometimes gain (or lose) tokens randomly.
                        Specifically, at the end of each streak, you have a 20% chance of winning 5 extra tokens, and a 20% chance of losing 5 tokens.</p>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you see "+5 Bonus," this means you randomly won 5 extra tokens. For example, this is what you'd see if you randomly won 5 extra tokens after a streak of three:</p>
                        <div class="play-area-inst">
                            <div class="win-text-inst" style="color:green">+30 Tokens</div>
                            <div class="plus-text-inst">+5 Bonus</div>
                        </div>`,

                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>This is what you'd see if you randomly won 5 extra tokens after a streak of zero:</p>
                        <div class="play-area-inst">
                            <div class="loss-text-inst">+0 Tokens</div>
                            <div class="plus-text-inst">+5 Bonus</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>If you see "-5 Loss," this means you randomly lost 5 tokens. For example, this is what you'd see if you randomly lost 5 tokens after a streak of three:</p></p>
                        <div class="play-area-inst">
                            <div class="win-text-inst" style="color:green">+30 Tokens</div>
                            <div class="minus-text-inst">-5 Loss</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>This is what you'd see if you randomly lost 5 tokens after a streak of zero:</p></p>
                        <div class="play-area-inst">
                            <div class="loss-text-inst">+0 Tokens</div>
                            <div class="minus-text-inst">-5 Loss</div>
                        </div>`,
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p><b>WARNING: During Red vs. Blue, you must respond to each tile as fast as possible!</b></p>
                        <p>Each tile will disappear very quickly. If you fail to respond correctly before a tile disappears, your response will be considered incorrect.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const intro_2 = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>The first version of Red vs. Blue is now complete!</p>
                        <p>Soon, you'll continue earning tokens by playing the second version of Red vs. Blue.</p>`
                    },
                ],
                [
                    {
                        type: 'html',
                        prompt: `<p>The second version of Red vs. Blue is identical to the first version with one exception: it is ${moreOrLess} difficult.</p>
                        <p>Specifically, most players make ${moreOrLess} errors in the second version compared to the first version.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        let inst;

        if (round == 2) {
            inst = intro_2;
        } else if (settings.gameType == "bern") {
            inst = howToEarn1_bern;
        } else if (settings.gameType == "streak") {
            inst = howToEarn1_strk;
        }

        const instLoop = {
          timeline: [inst, attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const readyToPlay = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>You're now ready to play the ${firstOrSecond} version of Red vs. Blue.</p>
                        <p>To begin, continue to the next screen.</p>`
                    },
                ],

            ],
            button_label_finish: 'Next',
        };

        this.timeline = [instLoop, readyToPlay];
       
    };


    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    p.intro_wordReading = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p><strong>What makes some activities more immersive and engaging than others?</strong></p>
                    <p>We're interested in why people feel effortlessly engaged in some activities (such as engrossing video games), but struggle to focus on other activities.</p>
                    <p>To help us, you'll play two different versions of a game called Red vs. Blue. After each game, you'll report how immersed and engaged you felt.</p>
                    <p>To learn about and play Red vs. Blue, continue to the next screen.</p></p>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>Red vs. Blue takes place in a play area like this one:</p>
                    <div class="play-area-inst">
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>Throughout the game, tiles will appear in the play area. On each tile, 
                    you'll see the word "red" or "blue" written in either red or blue font. Proceed to see some examples.</p>
                    <div class="play-area-inst">
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>This tile displays the word "red" in red font.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; top:25%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:#ff0000; top:25%; left:20%">red</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>This tile displays the word "red" in blue font.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; top:25%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:blue; top:25%; left:80%">red</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>This tile displays the word "blue" in blue font.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; top:75%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:blue; top:75%; left:20%">blue</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>This tile displays the word "blue" in red font.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; top:75%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:#ff0000; top:75%; left:80%">blue</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>When a tile appears at the <b>bottom</b> of the play area, you must indicate whether the <b>word is "red" or "blue"</b> (ignoring the font color).
                    Press Q on your keyboard if the word is "blue," and press P if the word is "red."
                    <div class="play-area-inst">
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key">Q<br>"blue"</div>
                        <div class="p-key">P<br>"red"</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>For example, you should respond to this tile by pressing Q.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; top:75%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:#ff0000; top:75%; left:80%">blue</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key">Q<br>"blue"</div>
                        <div class="p-key">P<br>"red"</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>You should respond to this tile by pressing P.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; top:75%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:blue; top:75%; left:20%">red</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key">Q<br>"blue"</div>
                        <div class="p-key">P<br>"red"</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>If you respond correctly, the tile will "activate" like this:</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; border: 5px solid black; top:75%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:blue; top:75%; left:20%">red</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key">Q<br>"blue"</div>
                        <div class="p-key">P<br>"red"</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>If you respond incorrectly, the tile will disappear.</p>
                    <div class="play-area-inst">
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key">Q<br>"blue"</div>
                        <div class="p-key">P<br>"red"</div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>To practice identifying the word on each tile, you'll complete a few practice rounds. During the practice rounds, tiles will always appear at the bottom of the play area, so your goal is always to
                    identify whether the word is "red" or "blue."</p>
                    <p>Continue to start practicing.</p>`,
                }
            ],

        ],
        button_label_finish: 'Next'
    };

    p.intro_colorNaming = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p>Practice is now complete.</p>
                    <p>Next, you'll learn what happens when a tile appears at the top of the play area.</p>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>When a tile appears at the <b>top</b> of the play area, you must indicate whether the <b>font color is red or blue</b> (ignoring the word).
                    Press Q if the font is blue, and press P if the font is red.
                    <div class="play-area-inst">
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q<br><div class="blue-rec"></div> </div>
                        <div class="p-key"> P<br><div class="red-rec"></div> </div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>For example, you should respond to this tile by pressing P.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; top:25%; left:80%"></div>
                        <div class="stroop-stim-inst" style="color:#ff0000; top:25%; left:80%">blue</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="blue-rec"></div> </div>
                        <div class="p-key"> P <div class="red-rec"></div> </div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>You should respond to this tile by pressing Q.</p>
                    <div class="play-area-inst">
                        <div class="tile-inst" style="background-color:#b3b3b3; top:25%; left:20%"></div>
                        <div class="stroop-stim-inst" style="color:blue; top:25%; left:20%">red</div>
                    </div>
                    <div class="keycodes-inst">
                        <div class="q-key"> Q <div class="blue-rec"></div> </div>
                        <div class="p-key"> P <div class="red-rec"></div> </div>
                    </div>`
                },
            ],

            [
                {
                    type: 'html',
                    prompt: `<p>To practice identifying the font color on each tile, you'll complete a few practice rounds. During the practice rounds, tiles will always appear at the top of the play area, so your goal is always to
                    identify whether the font is red or blue.</p>
                    <p>Continue to start practicing.</p>`,
                }
            ],

        ],
        button_label_finish: 'Next'
    };

    p.intro_combined = {
        type: jsPsychSurvey,
        pages: [
            [
                {
                    type: 'html',
                    prompt: `<p>Practice is now complete.</p>
                    <p>Now that you've practiced both tasks (naming words and identifying font colors), you'll practice doing both tasks at once.</p>
                    <p>Specifically, in the next practice session, the tile will sometimes appear at the top of the play area (requiring you to identify the font color).
                    Other times, the tile will appear at the bottom of the play area (requiring you to identify the word).</p>
                    <p>Continue when you're ready to practice performing both tasks at once.</p>`
                },
            ],
        ],
        button_label_finish: 'Next'
    };

    const attnChk1 = new MakeAttnChk(settings, 1);

    const attnChk2 = new MakeAttnChk(settings, 2);

    
   /*
    *
    *   TASK
    *
    */


    // temporary variables for flanker task


    const MakeTimeline = function(round, gameType, isPractice, practiceType) {

        let correct, stim;
        let trial = 1;
        const trialType1 = (settings.difficulty[round] == "easy") ? "congruent" : "incongruent";
        const trialType2 = "doubleIncongruent";
        const trialType1_prob = (settings.difficulty[round] == "easy") ? .9 : .5;

        const congruentStim = [
            ['blue', 'blue', '20%', '30%', 'q'], 
            ['blue', 'blue', '20%', '80%', 'q'], 
            ['red', '#ff0000', '80%', '30%', 'p'], 
            ['red', '#ff0000', '80%', '80%', 'p'],
        ];
        const incongruentStim = [
            ['blue', 'blue', '80%', '30%', 'q'], 
            ['blue', 'blue', '80%', '80%', 'q'], 
            ['blue', '#ff0000', '80%', '30%', 'p'], 
            ['blue', '#ff0000', '20%', '80%', 'q'],
            ['red', '#ff0000', '20%', '30%', 'p'], 
            ['red', '#ff0000', '20%', '80%', 'p'],
            ['red', 'blue', '20%', '30%', 'q'], 
            ['red', 'blue', '80%', '80%', 'p'],
        ];

        const doubleIncongruentStim = [
            ['blue', '#ff0000', '20%', '30%', 'p'], 
            ['blue', '#ff0000', '80%', '80%', 'q'],
            ['red', 'blue', '80%', '30%', 'q'], 
            ['red', 'blue', '20%', '80%', 'p'],
        ];

        let practiceStim = [congruentStim[0], congruentStim[2], incongruentStim[0], incongruentStim[2], incongruentStim[4], incongruentStim[6]];
        if (practiceType == "word") {
            practiceStim = [congruentStim[1], congruentStim[3], incongruentStim[1], incongruentStim[3], incongruentStim[5], incongruentStim[7]];
        };

        let congruentStim_shuffled = jsPsych.randomization.repeat(congruentStim, 1);
        let incongruentStim_shuffled = jsPsych.randomization.repeat(incongruentStim, 1);
        let doubleIncongruentStim_shuffled = jsPsych.randomization.repeat(doubleIncongruentStim, 1);
        let practiceStim_shuffled = jsPsych.randomization.repeat(practiceStim, 1);

        // html
        const headerViz = (gameType == 'bern' || isPractice) ? 'hidden' : 'visible';
        const playArea = '<div class="play-area">' + `<div class="header" style="visibility:${headerViz}">{headerContent}</div>` + '<div class="tile" style="background-color:{tileColor}; border:{borderStyle}; top:{yPos}; left:{xPos}"></div>' + '<div class="stroop-stim" style="color:{stimColor}; top:{yPos}; left:{xPos}">{stimContent}</div>' +'</div>';
        const feedbackArea = '<div class="play-area">{token-text}{extra-text}</div>';
        const winText = '<div class="win-text">+10 Tokens</div>';
        const lossText = '<div class="loss-text">+0 Tokens</div>';
        const plusText = '<div class="plus-text">+5 Bonus</div>';
        const minusText = '<div class="minus-text">-5 Loss</div>';
        let keyLabels = `<div class="keycodes"> <div class="q-key"> Q <div class="blue-rec"></div> "blue" </div> <div class="p-key"> P <div class="red-rec"></div> "red" </div> </div>`;
        if (practiceType == "word") {
            keyLabels = `<div class="keycodes"> <div class="q-key">Q<br>"blue"</div> <div class="p-key">P<br>"red"</div> </div>`;
        } else if (practiceType == "color") {
            keyLabels = `<div class="keycodes"> <div class="q-key"> Q <div class="blue-rec"></div> </div> <div class="p-key"> P <div class="red-rec"></div> </div> </div>`;
        };

        // make array of token outcomes 
        const makeTokenArray = function() {
          return jsPsych.randomization.repeat(['plus', 'minus', 'normal', 'normal', 'normal'], 1);
        };

        // make array of trial types
        const makeTrialTypeArray = function(trialType1, trialType2, trialType1_prob, nTrials) {
            const nTrialType1 = Math.round(10 * trialType1_prob);
            const nTrialType2 = 10 - nTrialType1;
            const nChunks = Math.round(nTrials / 10);
            const miniArray1 = Array(nTrialType1).fill(trialType1);
            const miniArray2 = Array(nTrialType2).fill(trialType2);
            const chunk = miniArray1.concat(miniArray2);
            let fullArray = [];
            for (let i = 0; i < nChunks; i++) {
                let chunk_shuffled = jsPsych.randomization.repeat(chunk, 1);
                fullArray.push(...chunk_shuffled);
            };
            return fullArray;
        };

        let tokenArray_win = makeTokenArray();
        let tokenArray_loss = makeTokenArray();
        let trialTypeArray = makeTrialTypeArray(trialType1, trialType2, trialType1_prob, settings.nTrials);
        let trialTypeArray_combined = makeTrialTypeArray("congruent", "incongruent", .5, 20);

        // variables for streak condition
        let streak = 0;
        let finalStreak;

        const iti = {
            type:jsPsychHtmlKeyboardResponse,
            stimulus: () => {
                return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', 'white').replace('{stimColor}', 'black').replace('{stimContent}', '') + keyLabels;
            },
            choices: "NO_KEYS",
            trial_duration: () => {
                let latency = Math.floor(Math.random() * 1500 + 250);
                return latency;
            },
            data: {phase: 'iti', round: round + 1},
            on_finish: (data) => {
                data.trial_idx = trial;
                data.practice = isPractice;
           },
        };

        const response = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                if (isPractice && practiceType !== "combined") {
                    stim = practiceStim_shuffled.pop()
                } else if (practiceType == "combined") {
                    stim = (trialTypeArray_combined[trial - 1] == "congruent") ? congruentStim_shuffled.pop() : incongruentStim_shuffled.pop();
                } else if (settings.difficulty[round] == 'easy') {
                    stim = (trialTypeArray[trial - 1] == "congruent") ? congruentStim_shuffled.pop() : doubleIncongruentStim_shuffled.pop();
                } else {
                    stim = (trialTypeArray[trial - 1] == "incongruent") ? incongruentStim_shuffled.pop() : doubleIncongruentStim_shuffled.pop();
                };
                return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', '#b3b3b3').replaceAll('{xPos}', stim[2]).replaceAll('{yPos}', stim[3]).replace('{stimColor}', stim[1]).replace('{stimContent}', stim[0]) + keyLabels;
            },
            trial_duration: () => {
                if (isPractice) {
                    return 10000;
                } else {
                    return 700;
                }
            },
            data: {phase: 'response', round: round + 1},
            on_finish: (data) => {
                correct = (data.response == stim[4]) ? 1 : 0;
                data.trial_idx = trial;
                data.practice = isPractice;
                data.correct = correct;
                if (congruentStim_shuffled.length == 0 || incongruentStim_shuffled.length == 0 || doubleIncongruentStim_shuffled.length == 0 || practiceStim_shuffled.length == 0) {
                    congruentStim_shuffled = jsPsych.randomization.repeat(congruentStim, 1);
                    incongruentStim_shuffled = jsPsych.randomization.repeat(incongruentStim, 1);
                    doubleIncongruentStim_shuffled = jsPsych.randomization.repeat(doubleIncongruentStim, 1);
                    practiceStim_shuffled = jsPsych.randomization.repeat(practiceStim, 1);
                };
            },
        };

        const outcome = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                let tileColor = (correct == 1) ? '#b3b3b3' : 'white';
                let stimColor = (correct == 1) ? stim[1] : 'white';
                let borderStyle = (correct == 1) ? '5px solid black' : null;
                let outcome_html;
                return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', tileColor).replace('{borderStyle}', borderStyle).replaceAll('{xPos}', stim[2]).replaceAll('{yPos}', stim[3]).replace('{stimColor}', stimColor).replace('{stimContent}', stim[0]) + keyLabels;
            },
            choices: "NO_KEYS",
            trial_duration: 1000,
            data: {phase: 'outcome', round: round + 1},
            on_finish: (data) => {
                if (correct == 1) {
                    streak++;
                    if (trial == settings.nTrials) {
                        finalStreak = streak;
                        streak = 0;
                    };
                } else {
                    finalStreak = streak;
                    streak = 0;
                };
                data.trial_idx = trial;
                data.practice = isPractice;
                if (isPractice) { trial++ };
            },
        };

        const tokens = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                let standardFeedback;
                if (correct == 1) {
                    standardFeedback = winText;
                    if (gameType == 'streak' && trial == settings.nTrials) {
                        standardFeedback = winText.replace('10', `${10 * finalStreak}`)
                    };
                } else if (gameType == 'bern') {
                    standardFeedback = lossText;
                } else if (finalStreak == 0) {
                    standardFeedback = lossText;
                } else if (finalStreak > 0) {
                    standardFeedback = winText.replace('10', `${10 * finalStreak}`)
                };
                let bonusFeedbackType = (correct == 1) ? tokenArray_win.pop() : tokenArray_loss.pop();
                let bonusFeedback = (bonusFeedbackType == 'plus') ? plusText : (bonusFeedbackType == 'minus') ? minusText : '';
                if (gameType == 'streak' && correct == 1 && trial < settings.nTrials) {
                    return playArea.replace('{headerContent}', `Current Streak: ${streak}`).replace('{tileColor}', 'white').replace('{stimColor}', 'black').replace('{stimContent}', '') + keyLabels;
                } else {
                    return feedbackArea.replace('{token-text}', standardFeedback).replace('{extra-text}', bonusFeedback) + keyLabels;
                }
            },
            choices: "NO_KEYS",
            trial_duration: 2250,
            data: {phase: 'feedback', round: round + 1},
            on_finish: function(data) {
                if (tokenArray_win.length == 0) {
                    tokenArray_win = makeTokenArray();
                };
                if (tokenArray_loss.length == 0) {
                    tokenArray_loss = makeTokenArray();
                };
                data.trial_idx = trial;
                trial++;
                data.practice = isPractice;
            },
        };

        if (!isPractice) {
            this.timeline = [iti, response, outcome, tokens];
            this.repetitions = settings.nTrials;
        } else {
            this.timeline = [iti, response, outcome];
            this.repetitions = (practiceType == "combined") ? 20 : 10;            
        }


    };

    p.wordPractice = new MakeTimeline(0, settings.gameType, true, "word");
    p.colorPractice = new MakeTimeline(0, settings.gameType, true, "color");
    p.combinedPractice = new MakeTimeline(0, settings.gameType, true, "combined");

    const flanker_timeline_1 = new MakeTimeline(0, settings.gameType, false, null);
    const flanker_timeline_2 = new MakeTimeline(1, settings.gameType, false, null);


   /*
    *
    *   QUESTIONS
    *
    */

    // scales
    const zeroToExtremely = ["0<br>A little", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>Extremely"];
    const zeroToALot = ['0<br>A little', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10<br>A lot'];

    // constructor functions
    function MakeFlowQs(round) {
        const firstOrSecond = (round == 1) ? "first" : "second";
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px; color:rgb(109, 112, 114)'>
        <p>Thank you for completing the ${firstOrSecond} version of Red vs. Blue!</p>
        <p>During the ${firstOrSecond} version of Red vs. Blue, to what extent did you feel<br><b>immersed</b> and <b>engaged</b> in what you were doing?</p>
        <p>Report the degree to which you felt immersed and engaged by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During the ${firstOrSecond} version of Red vs. Blue, how <strong>absorbed</strong> did you feel in what you were doing?</div>`,
                name: `absorbed`,
                labels: ["0<br>Not very absorbed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More absorbed than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During the ${firstOrSecond} version of Red vs. Blue, how <strong>immersed</strong> did you feel in what you were doing?</div>`,
                name: `immersed`,
                labels: ["0<br>Not very immersed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More immersed than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During the ${firstOrSecond} version of Red vs. Blue, how <strong>engaged</strong> did you feel in what you were doing?</div>`,
                name: `engaged`,
                labels: ["0<br>Not very engaged", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More engaged than I've ever felt"],
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>During the ${firstOrSecond} version of Red vs. Blue, how <strong>engrossed</strong> did you feel in what you were doing?</div>`,
                name: `engrossed`,
                labels: ["0<br>Not very engrossed", '1', '2', '3', '4', '5', '6', '7', '8', '9', "10<br>More engrossed than I've ever felt"],
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: round};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEnjoyQs(round) {
        const firstOrSecond = (round == 1) ? "first" : "second";
        this.type = jsPsychSurveyLikert;
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px; color:rgb(109, 112, 114)'>

        <p>Below are a few more questions about the ${firstOrSecond} version of Red vs. Blue.</p>

        <p>Instead of asking about immersion and engagement, these questions ask about <strong>enjoyment</strong>.<br>
        Report how much you <strong>enjoyed</strong> the ${firstOrSecond} version of Red vs. Blue by answering the following questions.</p></div>`;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>enjoy</strong> playing the ${firstOrSecond} version of Red vs. Blue?</div>`,
                name: `enjoyable`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>like</strong> playing the ${firstOrSecond} version of Red vs. Blue?</div>`,
                name: `like`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much did you <strong>dislike</strong> playing the ${firstOrSecond} version of Red vs. Blue?</div>`,
                name: `dislike`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How much <strong>fun</strong> did you have playing the ${firstOrSecond} version of Red vs. Blue?</div>`,
                name: `fun`,
                labels: zeroToALot,
                required: true,
            },
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How <strong>entertaining</strong> was the ${firstOrSecond} version of Red vs. Blue?</div>`,
                name: `entertaining`,
                labels: zeroToExtremely,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: round};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);
        };
    };

    function MakeEffortQs(round) {
        const firstOrSecond = (round == 1) ? "first" : "second";
        this.type = jsPsychSurveyLikert;
        this.questions = [
            {
                prompt: `<div style='color:rgb(109, 112, 114)'>How <b>effortful</b> was the ${firstOrSecond} version of Red vs. Blue?</div>`,
                name: `effort`,
                labels: zeroToALot,
                required: true,
            },
        ];
        this.randomize_question_order = false;
        this.scale_width = 700;
        this.data = {round: round};
        this.on_finish = (data) => {
            dmPsych.saveSurveyData(data);      
        };
    };


    // timeline: second wheel
    p.leftOrRight_timeline_1 = {
        timeline: [attnChk1, flanker_timeline_1, new MakeFlowQs(1), new MakeEnjoyQs(1), new MakeEffortQs(1)],
    };

    p.leftOrRight_timeline_2 = {
        timeline: [attnChk2, flanker_timeline_2, new MakeFlowQs(2), new MakeEnjoyQs(2), new MakeEffortQs(2)],
    };

   /*
    *
    *   Demographics
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: [`<div class='parent' style='color: rgb(109, 112, 114)'>
                    <p>Both games are now complete!</p>
                    <p>To finish this study, please continue to answer a few final questions.</p>
                    </div>`],
            show_clickable_nav: true,
            post_trial_gap: 500,
            allow_keys: false,
        };

        const meanOfEffScale = ['-2<br>Strongly<br>Disagree', '-1<br>Disagree', '0<br>Neither agree<br>nor disagree', '1<br>Agree', '2<br>Strongly<br>Agree'];

        const meanOfEff = {
            type: jsPsychSurveyLikert,
            preamble:
                `<div style='padding-top: 50px; width: 900px; font-size:16px; color: rgb(109, 112, 114)'>
                    <p><strong>Please answer the following questions as honestly and accurately as possible.</strong></p>
                </div>`,
            questions: [
                {
                    prompt: `Pushing myself helps me see the bigger picture.`,
                    name: `meanOfEff_1`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `I often don't understand why I am working so hard.`,
                    name: `meanOfEff_2r`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `I learn the most about myself when I am trying my hardest.`,
                    name: `meanOfEff_3`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `Things make more sense when I can put my all into them.`,
                    name: `meanOfEff_4`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I work hard, it rarely makes a difference.`,
                    name: `meanOfEff_5r`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I push myself, what I'm doing feels important.`,
                    name: `meanOfEff_6`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I push myself, I feel like I'm part of something bigger than me.`,
                    name: `meanOfEff_7`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `Doing my best gives me a clear purpose in life.`,
                    name: `meanOfEff_8`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I try my hardest, my life has meaning.`,
                    name: `meanOfEff_9`,
                    labels: meanOfEffScale,
                    required: true,
                },
                {
                    prompt: `When I exert myself, I feel connected to my ideal life.`,
                    name: `meanOfEff_10`,
                    labels: meanOfEffScale,
                    required: true,
                },
            ],
            randomize_question_order: false,
            scale_width: 500,
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [
                {
                    prompt: "Age:", 
                    name: "age",
                    required: true,
                }
            ],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychSurveyHtmlForm,
            preamble: '<p>What is your race / ethnicity?</p>',
            html: `<div style="text-align: left">
            <p>White / Caucasian <input name="ethnicity" type="radio" value="white"/></p>
            <p>Black / African American <input name="ethnicity" type="radio" value="black"/></p>
            <p>East Asian (e.g., Chinese, Korean, Vietnamese, etc.) <input name="ethnicity" type="radio" value="east-asian"/></p>
            <p>South Asian (e.g., Indian, Pakistani, Sri Lankan, etc.) <input name="ethnicity" type="radio" value="south-asian"/></p>
            <p>Latino / Hispanic <input name="ethnicity" type="radio" value="hispanic"/></p>
            <p>Middle Eastern / North African <input name="ethnicity" type="radio" value="middle-eastern"/></p>
            <p>Indigenous / First Nations <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Bi-racial <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Other <input name="other" type="text"/></p>
            </div>`,
            on_finish: (data) => {
                data.ethnicity = data.response.ethnicity;
                data.other = data.response.other;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 


        const demos = {
            timeline: [taskComplete, gender, age, ethnicity, english, finalWord]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "SjwKhHaBz07Y",
        filename: dmPsych.filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.intro_wordReading, exp.wordPractice, exp.intro_colorNaming, exp.colorPractice, exp.intro_combined, exp.combinedPractice,
    exp.leftOrRight_timeline_1, exp.leftOrRight_timeline_2, exp.demographics, exp.save_data];

jsPsych.run(timeline);
