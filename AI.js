

    let win_loss_states = [[4,1], [7,2], [0,3], [4,3], [4,5], [7,5], [5,7], [2,8], [7,8]];
    let qMatrix =  [[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]],
                    [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]];
    function onload() {
      displayQTableRepresentation(qMatrix);
    }

    function getAllPossibleNextAction(cur_pos) {
      return([0,1,2,3]);
    }

    function isGoalStateReached(cur_pos) {
      return isMatch(cur_pos, [7,5]);
    }

    function isMatch(array1,array2) {
      for (let i=0; i<array1.length;i++) {
        if(array1[i] != array2[i]) {
          return false;
        }
      }
      return true;
    }

    function getNextState(cur_pos, action) {
      if (action == 0) {
          return [cur_pos[0],(cur_pos[1] + 9)%10]
      }
      else if (action == 1) {
        return [(cur_pos[0] + 11)%10, cur_pos[1]];
      } else if (action == 2)
        return [cur_pos[0],(cur_pos[1] + 11)%10]
      else {
        return [(cur_pos[0] + 9)%10, cur_pos[1]];
      }
    }

    function isGameOver(cur_pos) {
      for (let pos of win_loss_states) {
        if (isMatch(pos, cur_pos)) {
          return true;
        }
      }
      return false;
    }

    function allEqual(array) {
      let first = array[0];
      for (let value of array) {
        if (value != first) {
          return false;
        }
      }
      return true;
    }


    function runTrain() {
      let times = document.getElementById("timesInput").value;
      train(times);
    }


    function train(times) {
      //console.log("qMatrix:");
      let envMatrix =  [[  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                        [  0,  0,  0,  0,-10,  0,  0,  0,  0,  0],
                        [  0,  0,  0,  0,  0,  0,  0,-10,  0,  0],
                        [-10,  0,  0,  0,-10,  0,  0,  0,  0,  0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                        [  0,  0,  0,  0,-10,  0,  0,100,  0,  0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
                        [  0,  0,  0,  0,  0,-10,  0,  0,  0,  0],
                        [  0,  0,-10,  0,  0,  0,  0,-10,  0,  0],
                        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0]];

      let discount = 0.9;
      let learning_rate = 0.1;
      let cur_pos = [0,0];

      let path = [];

      for (let i=0; i<times; i++) {
        cur_pos = [0,0];
        //console.log("Starting Episode "+i+"...")

        // Run a game
        path = [];
        count = 0;
        while(!isGameOver(cur_pos) && count < 50) {
          count++;
          //console.log("Move #"+ count);
          //console.log("Choosing Between: "+qMatrix[cur_pos[1]][cur_pos[0]][0]+", " + qMatrix[cur_pos[1]][cur_pos[0]][1]+", "+qMatrix[cur_pos[1]][cur_pos[0]][2]+", "+qMatrix[cur_pos[1]][cur_pos[0]][3]);
          let action = (allEqual(qMatrix[cur_pos[1]][cur_pos[0]]))? randInt(0,3) : qMatrix[cur_pos[1]][cur_pos[0]].indexOf(Math.max(...qMatrix[cur_pos[1]][cur_pos[0]]));
          if (randInt(1,5) == 5) {
            //console.log("Doing a random action Instead!");
            action = randInt(0,3);
          }
          let next_state = getNextState(cur_pos, action);
          //console.log("Current State: ["+cur_pos[0]+", "+cur_pos[1]+"], Action: "+action+", Next State: ["+next_state[0]+", "+next_state[1]+"]");
          path.push([cur_pos, action]);
          cur_pos = next_state;
          //console.log("------\n")
        }

        if (isGoalStateReached(cur_pos)) {
          //console.log("ROUND OVER: BEER!");
        } else {
          //console.log("ROUND OVER: HOLE!");
        }
        // Evaluate
        let score = envMatrix[cur_pos[1]][cur_pos[0]];
        //console.log("UPDATING Q-TABLE!");
        for (let i=0; i<path.length;i++) {
          //console.log("Move #" +(path.length-i));
          let move = path[path.length-i-1];
          let next_state = getNextState(move[0], move[1]);
          //console.log("Current State: ["+move[0][0]+", "+move[0][1]+"], Action: "+move[1]+", Next State: ["+next_state[0]+", "+next_state[1]+"]");
          let orig = qMatrix[move[0][1]][move[0][0]][move[1]];
          let modifier = (0.8**i)
          let addition = score * modifier;
          qMatrix[move[0][1]][move[0][0]][move[1]] = orig + addition;
          //console.log("Original Q-Val: "+orig+", FinalScore: "+score+", Modifier: "+modifier+ ", Addition: "+addition+", New Q-Val: "+qMatrix[move[0][1]][move[0][0]][move[1]]);
          //console.log("------\n")
        }

        //console.log("Episode "+i+" done");
        //console.log(qMatrix);
      }

      //console.log(qMatrix);
      //console.log("Training done.");
      displayQTableRepresentation(qMatrix);
    }

    function sumElement(element) {
      let sum = 0;
      for (let val of element) {
        sum += val;
      }
      return sum;
    }

    function mapToColor(value) {

      let max = 1000
      let min = -1000;
      if (value > max) {
        value = max;
      } else if (value < min) {
        value = min;
      }
      let percent = (value + 1000) / 2000;
      let greenVal = Math.round(255 * percent);
      let redVal = 255-greenVal;
      let greenHex = greenVal.toString(16);
      let redHex = redVal.toString(16);
      if (greenVal < 16) {
         greenHex = "0"+greenVal.toString(16);
      }
      if (redVal < 16) {
         redHex = "0"+redVal.toString(16);
      }
      ////console.log(value + " =>>> "+ "#"+redHex+greenHex+"00");
      return "#"+redHex+greenHex+"00";
    }

    function displayQTableRepresentation(qTable) {
      let colCount = -1;
      let rowCount = -1;
      let infoBox = document.getElementById("infoBox");
      infoBox.innerHTML = "";
      for (let row of qTable) {
        rowCount++;
        colCount = -1;
        for (let element of row) {
          colCount++;
          let value = sumElement(element);
          let color = mapToColor(value);
          let square = document.createElement("div");
          square.classList.add("square");
          if(rowCount == 0 && colCount == 0) {
            square.setAttribute("style","background: purple;");
          } else if (rowCount == 5 && colCount == 7) {
            square.setAttribute("style","background: gold;");
          } else {
            square.setAttribute("style","background: "+color+";");
          }
          infoBox.appendChild(square);
        }
      }
    }
