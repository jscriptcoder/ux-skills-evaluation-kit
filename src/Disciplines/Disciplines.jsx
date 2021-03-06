import React, { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Table, Slider, List } from 'antd'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsReact from 'highcharts-react-official'

import { AppContext } from '../Store'
import { ratings, groups } from '../services/content'
import radarOptions from '../services/radarOptions'

HighchartsMore(Highcharts)

const { Column } = Table
const { Item } = List

const slideMarks = [0, 1, 2, 3, 4, 5]
  .reduce((marks, val) => {
    marks[val] = val
    return marks
  }, {})

const tipFormatter = value => {
  return ratings[value]
}

export default function Disciplines(props) {
  const { groupId } = props
  const { state, dispatch } = useContext(AppContext)
  const { disciplines } = groups.find(group => group.id === groupId)
  const ratings = state[groupId]

  const chartOptions = useMemo(() => ({
    ...radarOptions,
    xAxis: {
      ...radarOptions.xAxis,
      categories: disciplines.map(discipline => discipline.title)
    },
    series: [{
      ...radarOptions.series[0],
      data: disciplines.map(discipline => ratings[discipline.id] || 0)
    }]
  }), [disciplines, ratings])

  return (
    <div className="Page Disciplines">
      <Row gutter={16}>
        <Col span={12}>
          <div className="Panel">
            <Table
              size="small"
              rowKey="id"
              pagination={false}
              dataSource={disciplines}>
              <Column
                title="Discipline"
                key="title"
                width={400} render={item => (
                  <Item style={{ marginRight: 16 }}>
                    <Item.Meta title={item.title} description={item.description} />
                  </Item>
                )} />
              <Column
                title="Rating"
                key="rating"
                render={item => (
                  <Slider
                    value={ratings[item.id]}
                    tipFormatter={tipFormatter}
                    onChange={rating => {
                      dispatch({
                        type: 'changeRating',
                        groupId,
                        disciplineId: item.id,
                        rating
                      })
                    }}
                    marks={slideMarks}
                    min={0}
                    max={5} />
                )} />
            </Table>
          </div>
        </Col>
        <Col span={12}>
          <div className="Panel">
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions} />
          </div>
        </Col>
      </Row>
    </div>
  )
}

Disciplines.propTypes = {
  groupId: PropTypes.string,
}
