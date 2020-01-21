# Toys

## Automata

![](img/examples/automata.png)

## Life

![](img/examples/life.gif)

## Lissajous

## Mandel

## Mondrian

![](img/examples/mondrian.png)

## Rubik

The `rubik` miniapp implements an interactive model of a Rubik's Cube&trade; puzzle.

![](img/examples/rubik.gif)

The basic interactive command is of the form `[xyz][1,2,3][0-3]` which
rotates, about the x, y, or z axis, a single tier, indicated by the
first integer, by a number of increments, indicated by the final
integer.  Any manipulation of the cube can be accomplished with a
sequence of these simple three character commands.

Common commands:

| Command    | Action                                                         |
|:-----------|:---------------------------------------------------------------|
| `R`        | Resets or re-paints the cube                                   |
| `S` or `s` | Solve the cube starting from the top and working down          |
| `r[0-9]+`  | Specific number of random moves                                |
| `p`        | Print the current state of the cube to the screen              |
| `q`        | Quit                                                           |

Other commands:

| Command    | Action                                                         |
|:-----------|:---------------------------------------------------------------|
| `T`        | Solve the top tier only                                        |
| `M`        | Solve the middle tier assuming the top has already been solved |
| `B`        | Solve the bottom tier assuming the top and middle are done     |
| `c`        | Swap bottom tier corners in positions 0 and 1                  |
| `t[0,1]`   | Twist, in place, three of the bottom tier corners              |
| `e[0,1]`   | Permute three of the bottom tier edges                         |
| `f[2,4]`   | Flip, in place, 2 or 4 of the bottom tier edges                |

## Snake

The `snake` miniapp provides a light-hearted example of mesh manipulation and
GLVis integration.

The Rubik's Snake&trade; a.k.a. Twist is a simple tool for experimenting with
geometric shapes in 3D. It consists of 24 triangular prisms attached in
a row so that neighboring wedges can rotate against each other but cannot
be separated. An astonishing variety of different configurations can be
reached.

![](img/examples/snake.png)

Thirteen pre-programmed configurations are available via the `-c
[0-12]` command line option.  Other configurations can be reached with
the `-u` option.  Each configuration must be 23 integers long
corresponding to the 23 joints making up the Snake&trade; puzzle. The
values can be 0-3 indicating how far to rotate the joint in the
clockwise direction when looking along the snake from the starting
(lower) end. The values 0, 1, 2, and 3 correspond to angles of 0, 90,
180, and 270 degrees respectively.
