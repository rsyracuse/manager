import * as React from 'react';
import { compose } from 'recompose';

import Button from 'src/components/Button';
import CopyTooltip from 'src/components/CopyTooltip';
import Grid from 'src/components/core/Grid';
import Paper from 'src/components/core/Paper';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from 'src/components/core/styles';
import Typography from 'src/components/core/Typography';
import HelpIcon from 'src/components/HelpIcon';
import Notice from 'src/components/Notice';

import { ExtendedType } from 'src/features/linodes/LinodesCreate/SelectPlanPanel';

import NodePoolDisplayTable from '../../CreateCluster/NodePoolDisplayTable';
import { getTotalClusterPrice } from '../../kubeUtils';
import { PoolNodeWithPrice } from '../../types';

type ClassNames =
  | 'root'
  | 'button'
  | 'pricing'
  | 'ctaOuter'
  | 'displayTable'
  | 'code'
  | 'footer'
  | 'footerText'
  | 'copyTooltip'
  | 'codeOuter'
  | 'tooltipCode'
  | 'statusHelpIcon'
  | 'nodePoolHeader'
  | 'nodePoolHeaderOuter'
  | 'tooltipCopyTooltip';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3)
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    pricing: {
      marginTop: theme.spacing(3),
      fontFamily: theme.font.bold,
      fontSize: '1rem',
      color: theme.color.headline
    },
    ctaOuter: {
      marginTop: theme.spacing(2) - 1
    },
    displayTable: {
      width: '100%'
    },
    code: {
      padding: `0 0 0 ${theme.spacing(1)}px`
    },
    footer: {
      display: 'flex',
      marginTop: theme.spacing(2)
    },
    footerText: {
      display: 'flex'
    },
    copyTooltip: {
      margin: '-4px 0'
    },
    codeOuter: {
      display: 'flex'
    },
    tooltipCode: {
      display: 'block',
      width: '100%'
    },
    statusHelpIcon: {},
    nodePoolHeader: {
      display: 'inline-block'
    },
    nodePoolHeaderOuter: {
      display: 'flex',
      alignItems: 'center'
    },
    tooltipCopyTooltip: {
      maxHeight: 24,
      marginLeft: 2
    }
  });

interface Props {
  editing: boolean;
  submittingForm: boolean;
  submissionSuccess: boolean;
  submissionError?: Linode.ApiFieldError[];
  pools: PoolNodeWithPrice[];
  poolsForEdit: PoolNodeWithPrice[];
  types: ExtendedType[];
  loading: boolean;
  toggleEditing: () => void;
  updatePool: (poolIdx: number, updatedPool: PoolNodeWithPrice) => void;
  deletePool: (poolID: number) => void;
  resetForm: () => void;
  submitForm: () => void;
}

type CombinedProps = Props & WithStyles<ClassNames>;

const command = 'kubectl get nodes -o wide';

export const NodePoolsDisplay: React.FunctionComponent<
  CombinedProps
> = props => {
  const {
    classes,
    deletePool,
    editing,
    loading,
    pools,
    poolsForEdit,
    resetForm,
    submitForm,
    submissionError,
    submissionSuccess,
    submittingForm,
    toggleEditing,
    types,
    updatePool
  } = props;

  const TooltipText = () => {
    return (
      <>
        For more detailed information about the nodes in your cluster, run the
        following command:
        <div className={classes.codeOuter}>
          <code className={classes.tooltipCode}>{command}</code>
          <CopyTooltip text={command} className={classes.tooltipCopyTooltip} />
        </div>
      </>
    );
  };

  return (
    <Paper className={classes.root}>
      <Grid container direction="column">
        <Grid
          container
          item
          direction="row"
          justify="space-between"
          alignItems="center"
          xs={12}
        >
          <Grid item className={classes.nodePoolHeaderOuter}>
            <Typography variant="h2" className={classes.nodePoolHeader}>
              Node Pools
            </Typography>
            <HelpIcon
              text={<TooltipText />}
              className={classes.statusHelpIcon}
              tooltipPosition="right-start"
              interactive
              customClassName="lke-tooltip"
            />
          </Grid>
          <Grid item>
            <Button buttonType="secondary" onClick={toggleEditing}>
              {editing ? 'Cancel' : 'Edit'}
            </Button>
          </Grid>
        </Grid>
        {submissionSuccess && (
          <Grid item xs={12}>
            <Notice success text={'Your node pools are being updated.'} />
          </Grid>
        )}
        {submissionError && submissionError.length > 0 && (
          <Grid item xs={12}>
            <Notice error text={submissionError[0].reason} />
          </Grid>
        )}
        <Grid item xs={12} className={classes.displayTable}>
          {editing ? (
            <NodePoolDisplayTable
              editable
              loading={loading}
              pools={poolsForEdit}
              types={types}
              handleDelete={deletePool}
              updatePool={updatePool}
            />
          ) : (
            <NodePoolDisplayTable
              pools={pools}
              types={types}
              loading={loading}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          {editing && (
            <Typography className={classes.pricing}>
              *Updated Monthly Estimate:{' '}
              {`$${getTotalClusterPrice(poolsForEdit)}/month`}
            </Typography>
          )}
          <Grid item container xs={12} className={classes.ctaOuter}>
            <Button
              className={classes.button}
              buttonType="primary"
              disabled={!editing || submittingForm}
              loading={submittingForm}
              onClick={submitForm}
            >
              Save
            </Button>
            <Button
              className={classes.button}
              buttonType="secondary"
              disabled={!editing}
              onClick={resetForm}
            >
              Clear Changes
            </Button>
          </Grid>
        </Grid>
        <Grid item className={classes.footer} xs={12}>
          <Typography className={classes.footerText}>
            You can run
            <code className={classes.code}>{command}</code>
            <CopyTooltip text={command} className={classes.copyTooltip} />
            for more detailed information about the nodes in your cluster.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

const styled = withStyles(styles);

const enhanced = compose<CombinedProps, Props>(
  React.memo,
  styled
);

export default enhanced(NodePoolsDisplay);
