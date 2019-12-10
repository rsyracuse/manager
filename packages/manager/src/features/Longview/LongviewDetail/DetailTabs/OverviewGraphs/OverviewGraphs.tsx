import * as React from 'react';
import Paper from 'src/components/core/Paper';
import { makeStyles, Theme } from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import Grid from 'src/components/Grid';
import { WithStartAndEnd } from '../../../request';
import TimeRangeSelect from '../../../shared/TimeRangeSelect';
import CPUGraph from './CPUGraph';
import DiskGraph from './DiskGraph';
import LoadGraph from './LoadGraph';
import MemoryGraph from './MemoryGraph';
import NetworkGraph from './NetworkGraph';

const useStyles = makeStyles((theme: Theme) => ({
  paperSection: {
    padding: theme.spacing(3) + 1,
    marginBottom: theme.spacing(1) + 3
  },
  selectOuter: {
    '& .time-range-select': {
      width: 150
    }
  }
}));

interface Props {
  clientAPIKey: string;
  timezone: string;
}
export type CombinedProps = Props;

export const OverviewGraphs: React.FC<CombinedProps> = props => {
  const { clientAPIKey, timezone } = props;
  const classes = useStyles();
  const [time, setTimeBox] = React.useState<WithStartAndEnd>({
    start: 0,
    end: 0
  });

  const handleStatsChange = (start: number, end: number) => {
    setTimeBox({ start, end });
  };

  const isToday = time.end - time.start < 60 * 60 * 25;

  const graphProps = {
    clientAPIKey,
    timezone,
    isToday,
    start: time.start,
    end: time.end
  };

  return (
    <Grid container item spacing={0}>
      <Grid
        container
        item
        direction="row"
        justify="space-between"
        alignItems="center"
        spacing={0}
        className="py0"
      >
        <Grid item>
          <Typography variant="h2">Resource Allocation History</Typography>
        </Grid>
        <Grid item className={classes.selectOuter}>
          <TimeRangeSelect
            handleStatsChange={handleStatsChange}
            defaultValue={'Past 30 Minutes'}
            label="Select Time Range"
            hideLabel
          />
        </Grid>
      </Grid>
      <Grid item />
      <Grid item xs={12}>
        <Paper className={classes.paperSection}>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            spacing={4}
          >
            <Grid item xs={12} sm={6}>
              <CPUGraph {...graphProps} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <MemoryGraph {...graphProps} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <NetworkGraph {...graphProps} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DiskGraph {...graphProps} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LoadGraph {...graphProps} />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OverviewGraphs;