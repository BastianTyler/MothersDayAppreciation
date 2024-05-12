var padding = { top: 20, right: 40, bottom: 0, left: 0 },
  w = 500 - padding.left - padding.right,
  h = 500 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  oldpick = [],
  color = d3.scale.category20()

var data = [
  { value: 1, question: 'I loved all the camping trips, thank you for them' },
  { value: 2, question: 'Thank you for always being there for me.' },
  { value: 3, question: 'I would never get tired of your cooking' },
  { value: 4, question: 'Thank you for teaching me how to cook' },
  { value: 5, question: 'Thank you for supporting me during all my lows' },
  { value: 6, question: 'You inspire me to try harder' },
  { value: 7, question: 'I love you with all my heart' },
  {
    value: 8,
    question:
      'Without your support I wouldnt be chasing my dreams like I am now, thank you',
  },
  { value: 9, question: 'Thank you for your patience and understanding.' },
  { value: 10, question: 'You helped me become who I am today' },
  { value: 11, question: 'Thank you for all the amazing memories' },
  { value: 12, question: 'I appreciate all the sacrifices you made for me' },
]

var svg = d3
  .select('#chart')
  .append('svg')
  .data([data])
  .attr('width', w + padding.left + padding.right)
  .attr('height', h + padding.top + padding.bottom)

var container = svg
  .append('g')
  .attr('class', 'chartholder')
  .attr(
    'transform',
    'translate(' + (w / 2 + padding.left) + ',' + (h / 2 + padding.top) + ')'
  )

var vis = container.append('g')

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return 1
  })

// Declare an arc generator function
var arc = d3.svg.arc().outerRadius(r)

// Select paths, use arc generator to draw
var arcs = vis
  .selectAll('g.slice')
  .data(pie)
  .enter()
  .append('g')
  .attr('class', 'slice')

arcs
  .append('path')
  .attr('fill', function (d, i) {
    return color(i)
  })
  .attr('d', function (d) {
    return arc(d)
  })

// Add numbers instead of labels
arcs
  .append('text')
  .attr('transform', function (d) {
    d.innerRadius = 0
    d.outerRadius = r
    d.angle = (d.startAngle + d.endAngle) / 2
    return (
      'rotate(' +
      ((d.angle * 180) / Math.PI - 90) +
      ')translate(' +
      (d.outerRadius - 10) +
      ')'
    )
  })
  .attr('text-anchor', 'end')
  .text(function (d, i) {
    return i + 1 // Display numbers 1 to 12
  })

container.on('click', spin)

function spin(d) {
  container.on('click', null)

  // All slices have been seen, all done
  console.log('OldPick: ' + oldpick.length, 'Data length: ' + data.length)
  if (oldpick.length == data.length) {
    console.log('done')
    container.on('click', null)
    return
  }

  var ps = 360 / data.length,
    pieslice = Math.round(1440 / data.length),
    rng = Math.floor(Math.random() * 1440 + 360)

  rotation = Math.round(rng / ps) * ps

  picked = Math.round(data.length - (rotation % 360) / ps)
  picked = picked >= data.length ? picked % data.length : picked

  if (oldpick.indexOf(picked) !== -1) {
    d3.select(this).call(spin)
    return
  } else {
    oldpick.push(picked)
  }

  rotation += 90 - Math.round(ps / 2)
  vis
    .transition()
    .duration(3000)
    .attrTween('transform', rotTween)
    .each('end', function () {
      // Mark question as seen
      d3.select('.slice:nth-child(' + (picked + 1) + ') path').attr(
        'fill',
        '#111'
      )

      // Populate question
      d3.select('#question h1').text(data[picked].question)

      oldrotation = rotation

      /* Get the result value from object "data" */
      console.log(data[picked].value)

      /* Comment the below line for restrict spin to sngle time */
      container.on('click', spin)
    })
}

// Make arrow
svg
  .append('g')
  .attr(
    'transform',
    'translate(' +
      (w + padding.left + padding.right) +
      ',' +
      (h / 2 + padding.top) +
      ')'
  )
  .append('path')
  .attr('d', 'M-' + r * 0.15 + ',0L0,' + r * 0.05 + 'L0,-' + r * 0.05 + 'Z')
  .style({ fill: 'black' })

// Draw spin circle
container
  .append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 60)
  .style({ fill: 'white', cursor: 'pointer' })

// Spin text
container
  .append('text')
  .attr('x', 0)
  .attr('y', 15)
  .attr('text-anchor', 'middle')
  .text('SPIN')
  .style({ 'font-weight': 'bold', 'font-size': '30px' })

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation)
  return function (t) {
    return 'rotate(' + i(t) + ')'
  }
}
