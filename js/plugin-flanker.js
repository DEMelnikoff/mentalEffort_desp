var jsPsychFlanker = (function (jspsych) {
  'use strict';

  const info = {
      name: "flanker",
      parameters: {
          /**
           * The HTML string to be displayed.
           */
          stimulus: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Stimulus",
              default: undefined,
          },
          /**
           * Array containing the key(s) the subject is allowed to press to respond to the stimulus.
           */
          choices: {
              type: jspsych.ParameterType.KEYS,
              pretty_name: "Choices",
              default: "ALL_KEYS",
          },
          /**
           * Any content here will be displayed below the stimulus.
           */
          prompt: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Prompt",
              default: null,
          },
          color: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Flanker color",
              default: null,
          },
          /**
           * How long to show the stimulus.
           */
          stimulus_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Stimulus duration",
              default: null,
          },
          /**
           * How long to show trial before it ends.
           */
          trial_duration: {
              type: jspsych.ParameterType.INT,
              pretty_name: "Trial duration",
              default: null,
          },
          /**
           * If true, trial will end when subject makes a response.
           */
          response_ends_trial: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Response ends trial",
              default: true,
          },
      },
  };
  /**
   * **html-keyboard-response**
   *
   * jsPsych plugin for displaying a stimulus and getting a keyboard response
   *
   * @author Josh de Leeuw
   * @see {@link https://www.jspsych.org/plugins/jspsych-html-keyboard-response/ html-keyboard-response plugin documentation on jspsych.org}
   */
  class FlankerPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
 
          let score = 0;
          let errors = 0;
          let target_idx = 0;
          let loss_index = 5 - Math.floor(Math.random() * 2 + 1);
          let jitter = Math.floor(Math.random() * 200);
          let new_html;

          const stim = trial.stimulus[2];
          if (trial.stimulus[0] == "easy") {
            new_html = `<div class="outcome-container-lose">
            <div class="your-score">Your Score:<br><br><b>${score}</b></div>
            <div class="flanker-symbol" style="color: ${trial.color}">${stim}</div></div>`;
          } else if (trial.stimulus[0] == "hard") {
            new_html = `<div class="outcome-container-lose">
            <div class="your-score">Your Score:<br><br><b>${score}</b></div>
            <div class="flanker-symbol" style="color: ${trial.color}"></div></div>`;            
          }

          // add prompt
          if (trial.prompt !== null) {
              new_html += trial.prompt;
          }
          // draw
          display_element.innerHTML = new_html;
          // store response
          var response = {
              rt: null,
              key: null,
          };
          // function to end trial when it is time
          const end_trial = () => {
              // kill any remaining setTimeout handlers
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // kill keyboard listeners
              if (typeof keyboardListener !== "undefined") {
                  this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
              }
              // gather the data to store for the trial
              var trial_data = {
                  rt: response.rt,
                  stimulus: trial.stimulus,
                  response: response.key,
                  score: score,
                  errors: errors,
              };
              // clear the display
              display_element.innerHTML = "";
              // move on to the next trial
              this.jsPsych.finishTrial(trial_data);
          };
          // function to handle responses by the subject
          var after_response = (info) => {

              if (stim.indexOf(info.key, score) == target_idx) {
                target_idx++;
                score++;
                console.log(score);
              } else {
                errors++;
              };

              if (trial.stimulus[0] == "easy") {
                new_html = `<div class="outcome-container-lose">
                <div class="your-score">Your Score:<br><br><b>${score}</b></div>
                <div class="flanker-symbol" style="color: ${trial.color}">${stim}</div></div>`;
              } else if (trial.stimulus[0] == "hard") {
                new_html = `<div class="outcome-container-lose">
                <div class="your-score">Your Score:<br><br><b>${score}</b></div>
                <div class="flanker-symbol" style="color: ${trial.color}"></div></div>`;            
              }

              display_element.innerHTML = new_html;

              // only record the first response
              if (response.key == null) {
                  response = info;
              }
              if (trial.response_ends_trial) {
                  end_trial();
              }

              if (trial.stimulus[1] == -1 & score == 5) {
                end_trial();
              } else if (trial.stimulus[1] == 1 & score == loss_index) {
                this.jsPsych.pluginAPI.setTimeout(end_trial, jitter)
              }

          };
          // start the response listener
          if (trial.choices != "NO_KEYS") {
              var keyboardListener = this.jsPsych.pluginAPI.getKeyboardResponse({
                  callback_function: after_response,
                  valid_responses: trial.choices,
                  rt_method: "performance",
                  persist: true,
                  allow_held_key: false,
              });
          }
          // hide stimulus if stimulus_duration is set
          if (trial.stimulus_duration !== null) {
              this.jsPsych.pluginAPI.setTimeout(() => {
                  display_element.querySelector("#jspsych-html-keyboard-response-stimulus").style.visibility = "hidden";
              }, trial.stimulus_duration);
          }
          // end trial if trial_duration is set
          if (trial.trial_duration !== null) {
             this.jsPsych.pluginAPI.setTimeout(end_trial, trial.trial_duration);
          }
      }
      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }
      create_simulation_data(trial, simulation_options) {
          const default_data = {
              stimulus: trial.stimulus,
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
              response: this.jsPsych.pluginAPI.getValidKey(trial.choices),
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }
      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          if (data.rt !== null) {
              this.jsPsych.pluginAPI.pressKey(data.response, data.rt);
          }
      }
  }
  FlankerPlugin.info = info;

  return FlankerPlugin;

})(jsPsychModule);